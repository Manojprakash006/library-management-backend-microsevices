import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { SuggestionsService } from './service/suggestions.service';
import { SuggestionsController } from './controller/suggestions.controller';
import { BookSuggestion, BookSuggestionSchema } from './entities/book-suggestion.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookSuggestion.name, schema: BookSuggestionSchema },
    ]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
