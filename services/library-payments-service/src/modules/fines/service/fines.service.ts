import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const html_to_pdf = require('html-pdf-node');
import { Fine, FineDocument, FineStatus, PaymentMethod } from '../entities/fine.entity';

import { CreateFineDto } from '../dto/create-fine.dto';
import { RedisEmitterService } from '../../redis-emitter/redis-emitter.service';

@Injectable()
export class FinesService {
  private razorpayInstance: any;
  private readonly logger = new Logger(FinesService.name);

  constructor(
    @InjectModel(Fine.name) private fineModel: Model<FineDocument>,
    private readonly httpService: HttpService,
    private readonly redisEmitter: RedisEmitterService,
  ) {
    this.razorpayInstance = new Razorpay({
      key_id: process.env.RZP_KEY_ID || 'rzp_test_SaDCl7Au48PRQf',
      key_secret: process.env.RZP_KEY_SECRET || 'Ge4uiF1mxjvZZ5LSXgy5PAZt',
    });
  }

  private async sendPaymentNotification(memberId: string | Types.ObjectId, amount: number, referenceId: string, bookId?: string) {
    const memberIdStr = memberId.toString();
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';

      // Fetch Book and Member details
      let bookTitle = 'Book';
      let memberName = 'Member';
      try {
        const [bookRes, memberRes] = await Promise.all([
          bookId ? firstValueFrom(this.httpService.get(`${booksServiceUrl}/books/${bookId}`)) : Promise.resolve(null),
          firstValueFrom(this.httpService.get(`${membersServiceUrl}/members/${memberIdStr}`))
        ]);
        if (bookRes) bookTitle = bookRes.data?.data?.title || 'Book';
        memberName = memberRes.data?.name || memberRes.data?.data?.name || 'Member';
      } catch (e) {
        this.logger.error(`Failed to fetch details for notification: ${e.message}`);
      }

      // Notify Member
      await firstValueFrom(this.httpService.post(`${membersServiceUrl}/notifications`, {
        memberId: memberIdStr,
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Successful',
        message: `Hi ${memberName}, your payment of ₹${amount} for "${bookTitle}" has been successfully received. Reference ID: ${referenceId}`,
      }));

      // Notify Admin
      await firstValueFrom(this.httpService.post(`${membersServiceUrl}/notifications/admin`, {
        type: 'PAYMENT_RECEIVED',
        title: 'New Payment Received',
        message: `Member ${memberName} (ID: ${memberIdStr}) has paid a fine of ₹${amount} for "${bookTitle}". Reference ID: ${referenceId}`,
      }));

      this.logger.log(`Successfully sent payment notification for member ${memberIdStr}`);
    } catch (error) {
      this.logger.error(`Failed to send payment notification for member ${memberIdStr}: ${error.message}`);
      if (error.response) {
        this.logger.error(`Error details: ${JSON.stringify(error.response.data)}`);
      }
    }
  }

  private async sendFineCreationNotification(memberId: string | Types.ObjectId, amount: number, reason: string, bookId?: string) {
    const memberIdStr = memberId.toString();
    try {
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
      const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';

      let bookTitle = 'Book';
      if (bookId) {
        try {
          const bookRes = await firstValueFrom(this.httpService.get(`${booksServiceUrl}/books/${bookId}`));
          bookTitle = bookRes.data?.data?.title || 'Book';
        } catch (e) {
          this.logger.error(`Failed to fetch book title: ${e.message}`);
        }
      }

      await firstValueFrom(this.httpService.post(`${membersServiceUrl}/notifications`, {
        memberId: memberIdStr,
        type: 'FINE_ADDED',
        title: 'New Fine Added',
        message: `Dear member, a fine of ₹${amount} has been added for "${bookTitle}". Reason: ${reason}. Please clear it at your earliest convenience.`,
      }));
    } catch (error) {
      this.logger.error(`Failed to send fine creation notification: ${error.message}`);
    }
  }

  async createFine(data: CreateFineDto): Promise<Fine> {
    const newFine = new this.fineModel({
      ...data,
      status: FineStatus.UNPAID,
    });
    const savedFine = await newFine.save();

    // Fire and forget notification
    this.sendFineCreationNotification(savedFine.memberId.toString(), savedFine.amount, savedFine.reason, savedFine.bookId?.toString());

    // Emit real-time event
    await this.redisEmitter.emit('FINE_CREATED', savedFine);
    await this.redisEmitter.emit('FINES_UPDATED', { type: 'create', fine: savedFine });

    return savedFine;
  }

  async checkPendingFines(memberId: string): Promise<{ hasPendingFines: boolean; totalPendingAmount: number; pendingFines: Fine[] }> {
    const pendingFines = await this.fineModel.find({ memberId, status: FineStatus.UNPAID }).exec();
    const totalAmount = pendingFines.reduce((sum, fine) => sum + fine.amount, 0);
    return {
      hasPendingFines: pendingFines.length > 0,
      totalPendingAmount: totalAmount,
      pendingFines,
    };
  }

  async getFineById(id: string): Promise<FineDocument> {
    const fine = await this.fineModel.findById(id).exec();
    if (!fine) {
      throw new NotFoundException(`Fine with ID ${id} not found`);
    }
    return fine;
  }

  async getAllFines(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [fines, total] = await Promise.all([
      this.fineModel.find().skip(skip).limit(limit).exec(),
      this.fineModel.countDocuments().exec(),
    ]);

    return {
      data: fines,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFinesByMemberId(memberId: string): Promise<Fine[]> {
    return this.fineModel.find({ memberId }).exec();
  }

  async payFine(id: string, paymentMethod: PaymentMethod, referenceId?: string): Promise<Fine> {
    const fine = await this.fineModel.findById(id).exec();
    if (!fine) {
      throw new NotFoundException(`Fine with ID ${id} not found`);
    }
    if (fine.status === FineStatus.PAID) {
      return fine;
    }
    fine.status = FineStatus.PAID;
    fine.paymentMethod = paymentMethod;
    fine.referenceId = referenceId;
    fine.paidAt = new Date();
    await fine.save();

    // Fire and forget notification and email invoice
    this.sendPaymentNotification(fine.memberId.toString(), fine.amount, fine.referenceId || fine._id.toString(), fine.bookId?.toString());
    this.sendInvoiceByEmail(fine._id.toString());

    // Emit real-time event
    await this.redisEmitter.emit('FINE_PAID', fine);
    await this.redisEmitter.emit('FINES_UPDATED', { type: 'pay', fine });

    return fine;
  }

  async createRazorpayOrder(fineId: string) {
    const fine = await this.getFineById(fineId);
    if (fine.status === FineStatus.PAID) {
      throw new BadRequestException(`Fine with ID ${fineId} is already paid`);
    }

    const options = {
      amount: Math.round(fine.amount * 100), // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_fine_${fineId}`,
    };

    try {
      const order = await this.razorpayInstance.orders.create(options);
      fine.razorpayOrderId = order.id;
      await fine.save();

      return {
        orderId: order.id,
        amount: options.amount,
        currency: options.currency,
        fineId,
      };
    } catch (error) {
      throw new BadRequestException('Could not create Razorpay order');
    }
  }

  async verifyRazorpayPayment(
    fineId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string
  ): Promise<Fine> {
    const fine = await this.getFineById(fineId);
    if (fine.status === FineStatus.PAID) {
      return fine; // Already handled
    }

    if (fine.razorpayOrderId !== razorpayOrderId) {
      throw new BadRequestException('Order ID mismatch');
    }

    const secret = process.env.RZP_KEY_SECRET || 'Ge4uiF1mxjvZZ5LSXgy5PAZt';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    // Update payment
    fine.status = FineStatus.PAID;
    fine.paymentMethod = PaymentMethod.UPI; // Default for online
    fine.referenceId = razorpayPaymentId;
    fine.paidAt = new Date();

    await fine.save();

    // Fire and forget notification and email invoice
    this.sendPaymentNotification(fine.memberId.toString(), fine.amount, fine.referenceId, fine.bookId?.toString());
    this.sendInvoiceByEmail(fine._id.toString());

    // Emit real-time event
    await this.redisEmitter.emit('FINE_PAID', fine);
    await this.redisEmitter.emit('FINES_UPDATED', { type: 'pay', fine });

    return fine;
  }

  async updateFine(id: string, data: Partial<CreateFineDto>): Promise<Fine> {
    const fine = await this.fineModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).exec();
    if (!fine) throw new NotFoundException('Fine not found');
    
    await this.redisEmitter.emit('FINES_UPDATED', { type: 'update', fine });
    return fine;
  }

  async deleteFine(id: string): Promise<{ message: string }> {
    const fine = await this.fineModel.findByIdAndDelete(id).exec();
    if (!fine) throw new NotFoundException('Fine not found');
    
    await this.redisEmitter.emit('FINES_UPDATED', { type: 'delete', id });
    return { message: 'Fine deleted successfully' };
  }

  async getInvoiceHtml(id: string, hideActions = false): Promise<string> {
    const fine = await this.fineModel.findById(id).exec();
    if (!fine) throw new NotFoundException('Fine not found');

    const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
    const booksServiceUrl = process.env.BOOKS_SERVICE_URL || 'http://localhost:3001';

    let bookTitle = 'N/A';
    let memberName = 'Member';
    let memberEmail = '';
    let libraryName = process.env.LIBRARY_NAME || 'City Central Library';
    let libraryAddress = process.env.LIBRARY_ADDRESS || '123 Library Street, City Center, State - 600001, India';
    let libraryPhone = process.env.LIBRARY_PHONE || '+91-44-1234-5678';
    let libraryEmail = process.env.LIBRARY_EMAIL || 'info@citycentrallibrary.org';
    let memberPhone = '';

    try {
      const [bookRes, memberRes, libRes] = await Promise.all([
        fine.bookId ? firstValueFrom(this.httpService.get(`${booksServiceUrl}/books/${fine.bookId}`)) : Promise.resolve(null),
        firstValueFrom(this.httpService.get(`${membersServiceUrl}/members/${fine.memberId}`)),
        firstValueFrom(this.httpService.get(`${membersServiceUrl}/contact/info`))
      ]);
      
      if (bookRes) bookTitle = bookRes.data?.data?.title || 'N/A';
      
      memberName = memberRes.data?.name || memberRes.data?.data?.name || 'Member';
      memberEmail = memberRes.data?.email || memberRes.data?.data?.email || '';
      memberPhone = memberRes.data?.phone || memberRes.data?.data?.phone || '';
      
      const libData = libRes.data?.data || libRes.data;
      if (libData) {
        libraryName = libData.libraryName || libraryName;
        libraryAddress = libData.address || libraryAddress;
        libraryPhone = libData.phone || libraryPhone;
        libraryEmail = libData.email || libraryEmail;
      }
    } catch (e) {
      this.logger.error(`Failed to fetch details for invoice: ${e.message}`);
    }

    const statusColor = fine.status === FineStatus.PAID ? '#10b981' : '#f59e0b';
    const statusBg = fine.status === FineStatus.PAID ? '#ecfdf5' : '#fffbeb';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${fine.fineId}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: #4f46e5;
            --primary-dark: #4338ca;
            --success: #10b981;
            --warning: #f59e0b;
            --text-main: #1f2937;
            --text-muted: #6b7280;
            --border: #e5e7eb;
            --bg-light: #f9fafb;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, sans-serif; 
            color: var(--text-main); 
            background: #f3f4f6;
            padding: 40px 20px;
            line-height: 1.5;
          }
          .invoice-card { 
            max-width: 850px; 
            margin: auto; 
            background: white; 
            border-radius: 24px; 
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            overflow: hidden;
            position: relative;
          }
          .invoice-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 8px;
            background: linear-gradient(90deg, var(--primary), #818cf8);
          }
          .header { padding: 48px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; }
          .logo-area h1 { font-size: 28px; font-weight: 800; color: var(--primary); letter-spacing: -0.025em; margin-bottom: 4px; }
          .logo-area p { font-size: 14px; color: var(--text-muted); font-weight: 500; }
          .status-badge {
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: ${statusBg};
            color: ${statusColor};
            border: 1px solid ${statusColor}20;
          }

          .details-grid { padding: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .info-block h3 { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
          .info-block p { font-size: 15px; font-weight: 500; color: var(--text-main); margin-bottom: 4px; }
          .info-block .id-badge { font-family: monospace; background: var(--bg-light); padding: 2px 6px; border-radius: 4px; font-size: 13px; }

          .table-section { padding: 0 48px; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 16px 0; border-bottom: 2px solid var(--border); font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
          td { padding: 24px 0; border-bottom: 1px solid var(--border); }
          .item-desc { font-weight: 600; color: var(--text-main); font-size: 15px; margin-bottom: 4px; }
          .item-sub { font-size: 13px; color: var(--text-muted); }
          .price-cell { text-align: right; font-weight: 700; color: var(--text-main); font-size: 16px; }

          .footer-section { padding: 48px; background: var(--bg-light); display: flex; justify-content: space-between; align-items: flex-end; }
          .total-box { text-align: right; }
          .total-box .label { font-size: 14px; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; }
          .total-box .amount { font-size: 32px; font-weight: 800; color: var(--text-main); letter-spacing: -0.025em; }
          .note-area { max-width: 400px; }
          .note-area h4 { font-size: 14px; font-weight: 700; margin-bottom: 8px; color: var(--text-main); }
          .note-area p { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

          .action-bar { max-width: 850px; margin: 0 auto 24px auto; display: flex; justify-content: flex-end; }
          .print-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
          }
          .print-btn:hover { background: var(--primary-dark); transform: translateY(-1px); }

          @media print {
            body { padding: 0; background: white; }
            .invoice-card { box-shadow: none; border: 1px solid var(--border); border-radius: 0; }
            .action-bar { display: none; }
            .invoice-card::before { display: none; }
          }
        </style>
      </head>
      <body>
        ${hideActions ? '' : `
        <div class="action-bar no-print">
          <button class="print-btn" onclick="window.print()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print Invoice
          </button>
        </div>
        `}

        <div class="invoice-card">
          <div class="header">
            <div class="logo-area">
              <h1>${libraryName}</h1>
            </div>
            <div style="text-align: right;">
              <div class="status-badge" style="margin-bottom: 12px;">${fine.status}</div>
              <p style="font-size: 13px; color: var(--text-muted);">Invoice #: <span class="id-badge" style="color: var(--text-main); font-weight: 600;">${fine.fineId}</span></p>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Date: <span style="color: var(--text-main); font-weight: 600;">${new Date(fine.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
            </div>
          </div>

          <div class="details-grid">
            <div class="info-block">
              <h3>Billed From</h3>
              <p style="font-size: 16px; font-weight: 700; color: var(--primary);">${libraryName}</p>
              <p>${libraryAddress}</p>
              <p style="margin-top: 8px; color: var(--text-muted); font-size: 13px;">Email: ${libraryEmail}</p>
              <p style="color: var(--text-muted); font-size: 13px;">Phone: ${libraryPhone}</p>
            </div>
            <div class="info-block">
              <h3>Billed To</h3>
              <p style="font-size: 16px; font-weight: 700;">${memberName}</p>
              <p>Member ID: <span class="id-badge">${fine.memberId}</span></p>
              <p>${memberEmail}</p>
              ${memberPhone ? `<p>${memberPhone}</p>` : ''}
            </div>
          </div>

          <div class="table-section">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="item-desc">Fine for: ${fine.reason}</div>
                    <div class="item-sub">Related Book: ${bookTitle}</div>
                    ${fine.paymentMethod && fine.paymentMethod !== 'CASH' ? `<div class="item-sub" style="color: var(--primary); font-weight: 600;">Transaction Reference: ${fine.referenceId}</div>` : ''}
                  </td>
                  <td class="price-cell">₹${fine.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="footer-section">
            <div class="note-area">
              <h4>Important Note</h4>
              <p>This invoice is automatically generated based on library records. For any discrepancies, please contact the library administration within 48 hours.</p>
              <p style="margin-top: 12px; font-weight: 600;">Payment Method: <span style="color: var(--primary);">${fine.paymentMethod || 'Manual Record'}</span></p>
            </div>
            <div class="total-box">
              <p class="label">Total Amount</p>
              <p class="amount">₹${fine.amount.toFixed(2)}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding-bottom: 24px; border-top: 1px solid var(--border); margin: 0 48px; padding-top: 24px;">
            <p style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Thank you for your continued support of our library services.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 24px; color: var(--text-muted); font-size: 11px; font-weight: 500;">
          Computer generated invoice. No physical signature required. &copy; ${new Date().getFullYear()} ${libraryName}
        </div>
      </body>
      </html>
    `;
  }

  async sendInvoiceByEmail(id: string): Promise<void> {
    try {
      this.logger.log(`Starting invoice email process for fine ID: ${id}`);
      
      // 1. Get HTML content (hide actions for PDF)
      const html = await this.getInvoiceHtml(id, true);
      
      // 2. Fetch member details for email and name
      const fine = await this.fineModel.findById(id).exec();
      if (!fine) return;
      
      const membersServiceUrl = process.env.MEMBERS_SERVICE_URL || 'http://localhost:3012';
      const memberRes = await firstValueFrom(this.httpService.get(`${membersServiceUrl}/members/${fine.memberId}`));
      const memberName = memberRes.data?.name || memberRes.data?.data?.name || 'Member';
      const memberEmail = memberRes.data?.email || memberRes.data?.data?.email;
      
      if (!memberEmail) {
        this.logger.warn(`No email found for member ${fine.memberId}, skipping invoice email.`);
        return;
      }
      
      // 3. Convert HTML to PDF
      this.logger.log(`Converting HTML to PDF for invoice ${fine.fineId}...`);
      const options = { 
        format: 'A4', 
        printBackground: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
      };
      const file = { content: html };
      
      const pdfBuffer = await html_to_pdf.generatePdf(file, options);
      this.logger.log(`PDF generated successfully for ${fine.fineId}`);
      
      // 4. Send to members service for email delivery
      await firstValueFrom(this.httpService.post(`${membersServiceUrl}/notifications/send-invoice-email`, {
        email: memberEmail,
        memberName: memberName,
        invoiceId: fine.fineId,
        pdfBase64: pdfBuffer.toString('base64'),
      }));
      
      this.logger.log(`Invoice email sent successfully to ${memberEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send invoice email: ${error.message}`);
    }
  }

  async getInvoicePdf(id: string): Promise<Buffer> {
    const html = await this.getInvoiceHtml(id, true);
    const options = { 
      format: 'A4', 
      printBackground: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    };
    const file = { content: html };
    return await html_to_pdf.generatePdf(file, options);
  }
}

