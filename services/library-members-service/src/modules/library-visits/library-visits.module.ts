import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryVisitsController } from './controller/library-visits.controller';
import { LibraryVisitsService } from './service/library-visits.service';
import { LibraryVisit, LibraryVisitSchema } from './entities/library-visit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LibraryVisit.name, schema: LibraryVisitSchema },
    ]),
  ],
  controllers: [LibraryVisitsController],
  providers: [LibraryVisitsService],
  exports: [LibraryVisitsService],
})
export class LibraryVisitsModule {}
