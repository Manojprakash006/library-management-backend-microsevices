import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LibraryVisit, LibraryVisitDocument } from '../entities/library-visit.entity';
import { CheckInDto, CheckOutDto } from '../dto/library-visit.dto';
import { NotificationsService } from '../../notifications/service/notifications.service';

@Injectable()
export class LibraryVisitsService {
  private readonly logger = new Logger(LibraryVisitsService.name);

  constructor(
    @InjectModel(LibraryVisit.name) private libraryVisitModel: Model<LibraryVisitDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private async getMemberDetails(memberIdStr: string): Promise<{ name: string; memberIdStr: string }> {
    try {
      const MemberSchema = this.libraryVisitModel.db.model('Member');
      const member = await MemberSchema.findById(memberIdStr).exec();
      if (member) {
        return { name: member.name, memberIdStr: member.memberId || memberIdStr };
      }
    } catch (err) {
      this.logger.error(`Failed to fetch member details: ${err.message}`);
    }
    return { name: 'Unknown Member', memberIdStr: memberIdStr };
  }

  private async getBookTitle(bookIdStr: string): Promise<string> {
    try {
      const ProductSchema = this.libraryVisitModel.db.model('Product');
      const book = await ProductSchema.findById(bookIdStr).exec();
      if (book) {
        return book.title || book.name || bookIdStr;
      }
    } catch (err) {
      this.logger.error(`Failed to fetch book details: ${err.message}`);
    }
    return bookIdStr;
  }


  async checkIn(checkInDto: CheckInDto) {
    try {
      const visit = new this.libraryVisitModel({
        memberId: checkInDto.memberId,
        timeIn: new Date(),
        purpose: checkInDto.purpose || 'reading',
        bookIds: checkInDto.bookId ? [checkInDto.bookId] : [],
        notes: checkInDto.notes,
        isActive: true,
      });

      const savedVisit = await visit.save();
      this.logger.log(`Member ${checkInDto.memberId} checked in at ${savedVisit.timeIn}`);

      const memberDetails = await this.getMemberDetails(checkInDto.memberId.toString());

      // Notify Staff about visitor check-in
      await this.notificationsService.notifyStaff({
        title: `${memberDetails.name} Visit In`,
        message: `Member ID: ${memberDetails.memberIdStr} checked in at ${savedVisit.timeIn.toLocaleTimeString()}. Purpose: ${savedVisit.purpose}`,
        type: 'VISITOR_IN'
      });

      return {
        message: 'Check-in successful',
        data: savedVisit,
      };
    } catch (error) {
      this.logger.error(`Check-in failed: ${error.message}`);
      throw error;
    }
  }

  async checkOut(checkOutDto: CheckOutDto) {
    try {
      const visit = await this.libraryVisitModel.findById(checkOutDto.visitId);
      
      if (!visit) {
        throw new Error('Visit record not found');
      }

      if (!visit.isActive) {
        throw new Error('Already checked out');
      }

      visit.timeOut = new Date();
      visit.isActive = false;
      if (checkOutDto.notes) {
        visit.notes = checkOutDto.notes;
      }

      const updatedVisit = await visit.save();
      this.logger.log(`Member ${visit.memberId} checked out at ${updatedVisit.timeOut}`);

      const memberDetails = await this.getMemberDetails(visit.memberId.toString());

      // Notify Staff about visitor check-out
      await this.notificationsService.notifyStaff({
        title: `${memberDetails.name} Visit Out`,
        message: `Member ID: ${memberDetails.memberIdStr} checked out at ${updatedVisit.timeOut.toLocaleTimeString()}.`,
        type: 'VISITOR_OUT'
      });

      return {
        message: 'Check-out successful',
        data: updatedVisit,
      };
    } catch (error) {
      this.logger.error(`Check-out failed: ${error.message}`);
      throw error;
    }
  }

  async getTodaysVisits() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const visits = await this.libraryVisitModel
        .find({
          timeIn: { $gte: today },
        })
        .populate('memberId', 'name email memberId')
        .sort({ timeIn: -1 })
        .exec();

      return visits;
    } catch (error) {
      this.logger.error(`Failed to get today's visits: ${error.message}`);
      return [];
    }
  }

  async getActiveVisits() {
    try {
      const visits = await this.libraryVisitModel
        .find({ isActive: true })
        .populate('memberId', 'name email memberId')
        .sort({ timeIn: -1 })
        .exec();

      return visits;
    } catch (error) {
      this.logger.error(`Failed to get active visits: ${error.message}`);
      return [];
    }
  }

  async getMemberVisitHistory(memberId: string) {
    try {
      const visits = await this.libraryVisitModel
        .find({ memberId })
        .sort({ timeIn: -1 })
        .exec();

      return visits;
    } catch (error) {
      this.logger.error(`Failed to get member visit history: ${error.message}`);
      return [];
    }
  }

  async createVisitForBookIssue(
    memberId: string,
    bookId: string,
    purpose: string = 'issue',
    timeIn?: Date,
    timeOut?: Date | null
  ) {
    try {
      // Check if member already has an active visit
      const existingVisit = await this.libraryVisitModel.findOne({
        memberId: new Types.ObjectId(memberId),
        isActive: true,
        timeOut: null,
      }).exec();

      if (existingVisit) {
        // Add bookId to existing visit's bookIds array if not already present
        if (!existingVisit.bookIds.includes(bookId)) {
          existingVisit.bookIds.push(bookId);
          await existingVisit.save();
          this.logger.log(`Added book ${bookId} to existing visit for member ${memberId}`);
        }
        return existingVisit;
      }

      // Create new visit if no active visit exists
      const visit = new this.libraryVisitModel({
        memberId: new Types.ObjectId(memberId),
        timeIn: timeIn || new Date(),
        timeOut: timeOut || null,
        purpose,
        bookIds: [bookId],
        isActive: !timeOut,
        isAutoRecorded: true,
      });

      const savedVisit = await visit.save();
      this.logger.log(`Auto-created new visit for book issue: Member ${memberId}, Book ${bookId}`);

      const memberDetails = await this.getMemberDetails(memberId.toString());
      const bookTitle = await this.getBookTitle(bookId.toString());

      // Notify Staff about auto-created visit
      await this.notificationsService.notifyStaff({
        title: `${memberDetails.name} Visit In`,
        message: `System auto-created a visit for Member ID: ${memberDetails.memberIdStr} due to book issue (Book Name: ${bookTitle}).`,
        type: 'VISITOR_IN'
      });

      return savedVisit;
    } catch (error) {
      this.logger.error(`Failed to create visit for book issue: ${error.message}`);
      return null;
    }
  }

  async recordReturnVisit(memberId: string, bookId: string) {
    try {
      // Find active visit for this member that contains the book
      const activeVisit = await this.libraryVisitModel.findOne({
        memberId: new Types.ObjectId(memberId),
        bookIds: bookId,
        isActive: true,
        timeOut: null,
      }).exec();

      if (activeVisit) {
        // Remove bookId from bookIds array
        activeVisit.bookIds = activeVisit.bookIds.filter(id => id !== bookId);

        // If no more books in this visit, mark as completed
        if (activeVisit.bookIds.length === 0) {
          activeVisit.timeOut = new Date();
          activeVisit.isActive = false;
          this.logger.log(`All books returned. Visit completed for member ${memberId}`);
          
          const memberDetails = await this.getMemberDetails(memberId.toString());

          // Notify Staff about auto-completed visit
          await this.notificationsService.notifyStaff({
            title: `${memberDetails.name} Visit Out`,
            message: `System auto-completed visit for Member ID: ${memberDetails.memberIdStr} as all books were returned.`,
            type: 'VISITOR_OUT'
          });
        } else {
          this.logger.log(`Book ${bookId} removed. Member ${memberId} still has ${activeVisit.bookIds.length} book(s)`);
        }

        await activeVisit.save();
        return activeVisit;
      }

      // If no active visit found, create a new return visit
      const returnVisit = new this.libraryVisitModel({
        memberId: new Types.ObjectId(memberId),
        bookIds: [bookId],
        timeIn: new Date(),
        timeOut: new Date(),
        purpose: 'return',
        isActive: false,
        isAutoRecorded: true,
      });
      await returnVisit.save();
      this.logger.log(`Created return visit: Member ${memberId}, Book ${bookId}`);

      const memberDetails = await this.getMemberDetails(memberId.toString());
      const bookTitle = await this.getBookTitle(bookId.toString());

      // Notify Staff about auto-created return log
      await this.notificationsService.notifyStaff({
        title: `${memberDetails.name} Visit Out`,
        message: `System auto-created a return log for Member ID: ${memberDetails.memberIdStr} (Book Name: ${bookTitle}).`,
        type: 'VISITOR_OUT'
      });

      return returnVisit;
    } catch (error) {
      this.logger.error(`Failed to record return visit: ${error.message}`);
      return null;
    }
  }

  async getVisitStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const count = await this.libraryVisitModel.countDocuments({
        timeIn: { $gte: today },
      }).exec();
      return count;
    } catch (error) {
      this.logger.error(`Failed to get visit stats: ${error.message}`);
      return 0;
    }
  }

  async getVisitsByDate(dateStr?: string) {
    try {
      let query = {};
      
      if (dateStr) {
        const start = new Date(dateStr);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(dateStr);
        end.setHours(23, 59, 59, 999);
        
        query = {
          timeIn: { $gte: start, $lte: end }
        };
      }

      const visits = await this.libraryVisitModel
        .find(query)
        .populate('memberId', 'name email memberId')
        .sort({ timeIn: -1 })
        .exec();

      return visits;
    } catch (error) {
      this.logger.error(`Failed to get visits by date: ${error.message}`);
      return [];
    }
  }
}
