import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { SuggestionsService } from '../service/suggestions.service';
import { CreateSuggestionDto, UpdateSuggestionStatusDto } from '../dto/suggestion.dto';
import { SuggestionStatus } from '../entities/book-suggestion.entity';
import { Public } from '../../../auth/guards/public.decorator';
import { Roles } from '../../../auth/guards/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Public()
  @Post()
  create(@Body() createSuggestionDto: CreateSuggestionDto) {
    return this.suggestionsService.create(createSuggestionDto);
  }

  @Roles('admin', 'staff', 'member')
  @Get()
  findAll(
    @Req() req: any,
    @Query('status') status?: SuggestionStatus,
    @Query('memberId') memberId?: string,
  ) {
    const user = req.user;
    
    // If it's a member, they can only see their own suggestions
    if (user.role === 'member') {
      const currentMemberId = user.id || user.userId;
      return this.suggestionsService.findAll(status, currentMemberId);
    }

    // Admins and staff can see all or filter by memberId
    return this.suggestionsService.findAll(status, memberId);
  }

  @Roles('admin', 'staff')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suggestionsService.findOne(id);
  }

  @Roles('admin', 'staff')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateSuggestionStatusDto: UpdateSuggestionStatusDto,
  ) {
    return this.suggestionsService.updateStatus(id, updateSuggestionStatusDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suggestionsService.remove(id);
  }
}
