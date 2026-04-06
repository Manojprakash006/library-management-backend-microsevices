import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');
import { Fine, FineDocument, FineStatus, PaymentMethod } from '../entities/fine.entity';

@Injectable()
export class FinesService {
  private razorpayInstance: any;

  constructor(
    @InjectModel(Fine.name) private fineModel: Model<FineDocument>,
  ) {
    this.razorpayInstance = new Razorpay({
      key_id: process.env.RZP_KEY_ID || 'rzp_test_SaDCl7Au48PRQf',
      key_secret: process.env.RZP_KEY_SECRET || 'Ge4uiF1mxjvZZ5LSXgy5PAZt',
    });
  }

  async createFine(data: { memberId: string; issueId: string; amount: number; reason: string }): Promise<Fine> {
    const newFine = new this.fineModel({
      ...data,
      status: FineStatus.UNPAID,
    });
    return newFine.save();
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
    return fine.save();
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
    
    return fine.save();
  }
}

