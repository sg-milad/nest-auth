import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserDto } from '../auth/dto/user.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(()=>{
        return {
          username: 'testuser',
          password: 'testpassword',
          roles: [],
        };
      }),
    };
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findOne', () => {
    
    it('should return undefined if no user found with the given username', async () => {
      const username = 'nonexistentuser';
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      const result = await usersService.findOne(username);

      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create a new user and return the saved user', async () => {
      const userDto: UserDto = {
        username: 'testuser',
        password: 'testpassword',
        roles: [],
      };
      const user = new User();
      Object.assign(user, userDto);
      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);

      const result = await usersService.createUser(userDto);

      expect(saveSpy).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(user);
    });

    it('should throw an InternalServerErrorException if an error occurs during user creation', async () => {
      const userDto: UserDto = {
        username: 'testuser',
        password: 'testpassword',
        roles: [],
      };
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(usersService.createUser(userDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  // Add more test cases for the remaining methods...

});
