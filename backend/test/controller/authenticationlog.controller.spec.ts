import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationlogController } from './authenticationlog.controller';

describe('AuthenticationlogController', () => {
  let controller: AuthenticationlogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationlogController],
    }).compile();

    controller = module.get<AuthenticationlogController>(AuthenticationlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
