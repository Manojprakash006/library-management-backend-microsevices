import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveManagementController } from './controller/leave-management.controller';
import { LeaveManagementService } from './service/leave-management.service';
import { LeaveRequest, LeaveRequestSchema } from './entities/leave-request.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LeaveRequest.name, schema: LeaveRequestSchema }]),
  ],
  controllers: [LeaveManagementController],
  providers: [LeaveManagementService],
  exports: [LeaveManagementService],
})
export class LeaveManagementModule {}
