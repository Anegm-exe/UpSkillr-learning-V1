import { Test, TestingModule } from '@nestjs/testing';
import { ForumController } from '../../src/forum/forum.controller';

describe('ForumController', () => {
  let controller: ForumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumController],
    }).compile();

    controller = module.get<ForumController>(ForumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
