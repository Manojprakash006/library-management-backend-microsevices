import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BookSuggestion, BookSuggestionDocument, SuggestionStatus } from '../entities/book-suggestion.entity';
import { CreateSuggestionDto, UpdateSuggestionStatusDto } from '../dto/suggestion.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SuggestionsService {
  private readonly logger = new Logger(SuggestionsService.name);

  constructor(
    @InjectModel(BookSuggestion.name) private suggestionModel: Model<BookSuggestionDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async sendNotification(memberId: string, type: string, title: string, message: string) {
    try {
      const membersServiceUrl = this.configService.get('MEMBERS_SERVICE_URL') || 'http://localhost:3012';
      this.logger.log(`Sending notification to ${membersServiceUrl}/notifications for member ${memberId}`);
      
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/notifications`, {
          memberId,
          type,
          title,
          message
        })
      );
      this.logger.log(`Notification sent successfully to member ${memberId}`);
    } catch (error) {
      this.logger.error(`Failed to send notification to member service: ${error.message}`);
    }
  }

  private async notifyAdmins(type: string, title: string, message: string) {
    try {
      const membersServiceUrl = this.configService.get('MEMBERS_SERVICE_URL') || 'http://localhost:3012';
      await firstValueFrom(
        this.httpService.post(`${membersServiceUrl}/notifications/admin`, {
          type,
          title,
          message
        })
      );
      this.logger.log(`Admin notification broadcasted: ${type}`);
    } catch (error) {
      this.logger.error(`Failed to broadcast to admins: ${error.message}`);
    }
  }

  async create(dto: CreateSuggestionDto) {
    const suggestion = new this.suggestionModel(dto);
    const savedSuggestion = await suggestion.save();

    // Notify admins about the new suggestion
    await this.notifyAdmins(
      'NEW_BOOK_REQUEST', // Reuse this type for admin alerts
      'New Book Suggestion',
      `A new book suggestion "${savedSuggestion.title}" has been submitted.`
    );

    return savedSuggestion;
  }

  async findAll(status?: SuggestionStatus, memberId?: string) {
    const query: any = {};
    if (status) query.status = status;
    if (memberId) query.memberId = memberId;

    return await this.suggestionModel.find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const suggestion = await this.suggestionModel.findById(id)
      .exec();
    if (!suggestion) throw new NotFoundException('Suggestion not found');
    return suggestion;
  }

  async updateStatus(id: string, dto: UpdateSuggestionStatusDto) {
    const suggestion = await this.suggestionModel.findByIdAndUpdate(
      id,
      { $set: { status: dto.status, remarks: dto.remarks } },
      { new: true }
    );
    if (!suggestion) throw new NotFoundException('Suggestion not found');

    // Send notification to member
    const statusLabel = suggestion.status === SuggestionStatus.APPROVED ? 'Approved' : 
                        suggestion.status === SuggestionStatus.REJECTED ? 'Rejected' : 
                        suggestion.status === SuggestionStatus.PROCURED ? 'Procured' : suggestion.status;
    
    const remarksText = dto.remarks ? `\n\nRemarks: ${dto.remarks}` : '';

    await this.sendNotification(
      suggestion.memberId.toString(),
      `SUGGESTION_${suggestion.status.toUpperCase()}`,
      `Book Suggestion ${statusLabel}`,
      `Your suggestion for "${suggestion.title}" by ${suggestion.author} has been ${statusLabel.toLowerCase()}.${remarksText}`
    );

    return suggestion;
  }

  async remove(id: string) {
    const result = await this.suggestionModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Suggestion not found');
    return { message: 'Suggestion deleted successfully' };
  }
}
