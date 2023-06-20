import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

enum Role {
  User = 'user',
  Admin = 'admin',
}

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user object if username and password are valid', async () => {
      const mockUser = {
        username: 'testuser',
        password: 'testpassword',
        userId: 1,
        roles: [Role.User], // Update roles to match the expected type
      };
      const findOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'testpassword');

      expect(findOneSpy).toHaveBeenCalledWith('testuser');
      expect(result).toEqual({ username: 'testuser', userId: 1, roles: [Role.User] });
    });

    it('should return null if username or password is invalid', async () => {
      const findOneSpy = jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser('testuser', 'testpassword');

      expect(findOneSpy).toHaveBeenCalledWith('testuser');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token when provided with a user object',async () => {
      const mockUser = {
        username: 'testuser',
        userId: 1,
        roles: [Role.User], // Update roles to match the expected type
      };
      const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue('mockToken');

      const resultPromise = authService.login(mockUser);
      const result = await resultPromise;
      
      expect(signSpy).toHaveBeenCalledWith({
        username: 'testuser',
        sub: 1,
        roles: [Role.User],
      });
      expect(result).toEqual({ access_token: 'mockToken' });
    });
  });
});
