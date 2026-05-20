import { Test, TestingModule } from '@nestjs/testing';
import { MemberProgressService } from './member-progress.service';

describe('MemberProgressService', () => {
  let service: MemberProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberProgressService],
    }).compile();

    service = module.get<MemberProgressService>(MemberProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
