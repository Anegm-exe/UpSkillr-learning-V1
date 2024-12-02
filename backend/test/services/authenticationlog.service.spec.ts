import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationlogService } from './authenticationlog.service';

describe('AuthenticationlogService', () => {
  let service: AuthenticationlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationlogService],
    }).compile();

    service = module.get<AuthenticationlogService>(AuthenticationlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
