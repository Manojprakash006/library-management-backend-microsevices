import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FinesService } from '../service/fines.service';
import { FineStatus } from '../entities/fine.entity';

@Controller()
export class FinesGrpcController {
  private readonly logger = new Logger(FinesGrpcController.name);

  constructor(private readonly finesService: FinesService) {}

  @GrpcMethod('FinesService', 'CreateFine')
  async createFine(data: { memberId: string; issueId: string; amount: number; reason: string }) {
    this.logger.log(`Received gRPC CreateFine request: ${JSON.stringify(data)}`);
    try {
      const fine = await this.finesService.createFine(data);
      return this.mapFineToResponse(fine);
    } catch (error) {
      this.logger.error(`Error creating fine: ${error.message}`, error.stack);
      throw error;
    }
  }

  @GrpcMethod('FinesService', 'CheckPendingFines')
  async checkPendingFines(data: { memberId: string }) {
    this.logger.log(`Received gRPC CheckPendingFines request for member: ${data.memberId}`);
    try {
      const result = await this.finesService.checkPendingFines(data.memberId);
      return {
        hasPendingFines: result.hasPendingFines,
        totalPendingAmount: result.totalPendingAmount,
        pendingFines: result.pendingFines.map(fine => this.mapFineToResponse(fine)),
      };
    } catch (error) {
      this.logger.error(`Error checking pending fines: ${error.message}`, error.stack);
      throw error;
    }
  }

  @GrpcMethod('FinesService', 'GetFine')
  async getFine(data: { id: string }) {
    this.logger.log(`Received gRPC GetFine request for ID: ${data.id}`);
    try {
      const fine = await this.finesService.getFineById(data.id);
      return this.mapFineToResponse(fine);
    } catch (error) {
      this.logger.error(`Error fetching fine: ${error.message}`, error.stack);
      throw error;
    }
  }

  private mapFineToResponse(fine: any) {
    return {
      id: fine._id.toString(),
      memberId: fine.memberId,
      issueId: fine.issueId,
      amount: fine.amount,
      reason: fine.reason,
      status: fine.status,
      paymentMethod: fine.paymentMethod || '',
      paidAt: fine.paidAt ? fine.paidAt.toISOString() : '',
      referenceId: fine.referenceId || '',
      createdAt: fine.createdAt ? fine.createdAt.toISOString() : '',
      updatedAt: fine.updatedAt ? fine.updatedAt.toISOString() : '',
    };
  }
}
