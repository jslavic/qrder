import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthenticationController } from './user-authentication.controller';

describe('UserAuthenticationController', () => {
  let controller: UserAuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthenticationController],
    }).compile();

    controller = module.get<UserAuthenticationController>(UserAuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
