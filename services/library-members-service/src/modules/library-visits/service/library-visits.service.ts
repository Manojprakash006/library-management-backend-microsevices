import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LibraryVisit, LibraryVisitDocument } from '../entities/library-visit.entity';
import { CheckInDto, CheckOutDto } from '../dto/library-visit.dto';

@Injectable()
export class LibraryVisitsService {
  private readonly logger = new Logger(LibraryVisitsService.name);

  constructor(
    @InjectModel(LibraryVisit.name) private libraryVisitModel: Model<LibraryVisitDocument>,
  ) {}

  async checkIn(checkInDto: CheckInDto) {
    try {
      const visit = new this.libraryVisitModel({
        memberId: checkInDto.memberId,
        timeIn: new Date(),
        purpose: checkInDto.purpose || 'reading',
        bookId: checkInDto.bookId,
        notes: checkInDto.notes,
        isActive: true,
      });

      const savedVisit = await visit.save();
      this.logger.log(`Member ${checkInDto.memberId} checked in at ${savedVisit.timeIn}`);

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
      return returnVisit;
    } catch (error) {
      this.logger.error(`Failed to record return visit: ${error.message}`);
      return null;
    }
  }
}
