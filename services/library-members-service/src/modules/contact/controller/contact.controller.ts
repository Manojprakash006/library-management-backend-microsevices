import { Controller, Post, Body, Get, UseGuards, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from '../service/contact.service';
import { CreateContactMessageDto } from '../dto/contact-message.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/guards/roles.decorator';
import { Public } from '../../../auth/guards/public.decorator';

@ApiTags('Contact Us')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('send')
  @Public()
  @ApiOperation({ summary: 'Send a message from contact us form' })
  async sendMessage(@Body() createDto: CreateContactMessageDto) {
    const result = await this.contactService.createMessage(createDto);
    return { message: 'Your message has been sent successfully', data: result };
  }

  @Get('messages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Get all contact messages (Admin/Staff only)' })
  async getMessages() {
    const result = await this.contactService.getAllMessages();
    return { message: 'Messages retrieved successfully', data: result };
  }

  @Patch('status/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Update message status (Admin/Staff only)' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const result = await this.contactService.updateMessageStatus(id, status);
    return { message: 'Status updated successfully', data: result };
  }

  @Post('reply/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Send email reply to visitor (Admin/Staff only)' })
  async sendReply(@Param('id') id: string, @Body('message') replyMessage: string) {
    const result = await this.contactService.sendReply(id, replyMessage);
    return { message: 'Reply sent successfully via email', data: result };
  }

  @Get('info')
  @Public()
  @ApiOperation({ summary: 'Get library contact info and hours (Public)' })
  async getLibraryInfo() {
    const result = await this.contactService.getLibraryConfig();
    return { message: 'Library info retrieved successfully', data: result };
  }

  @Patch('info')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiOperation({ summary: 'Update library contact info (Admin/Staff only)' })
  async updateLibraryInfo(@Body() updateData: any) {
    const result = await this.contactService.updateLibraryConfig(updateData);
    return { message: 'Library info updated successfully', data: result };
  }
}
