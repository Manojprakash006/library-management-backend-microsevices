import { Test, TestingModule } from '@nestjs/testing';
import { MemberProgressController } from './member-progress.controller';

describe('MemberProgressController', () => {
  let controller: MemberProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberProgressController],
    }).compile();

    controller = module.get<MemberProgressController>(MemberProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
