import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { UsersService } from '../src/modules/users/users.service';
import { JwtAuthGuard } from '../src/guards/jwt-auth.guard';
import { RolesGuard } from '../src/guards/roles.guard';
import { LocalAuthGuard } from '../src/guards/local-auth.guard';
import { Role } from '../src/constants/role.enum';
import { HasRoles } from '../src/decorators/has-roles.decorator';
import { UserDto } from '../src/modules/auth/dto/user.dto';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService],
      imports:[ConfigModule.forRoot(),
        UsersModule,
        PassportModule,]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const userDto: UserDto = {
        username: 'testuser',
        password: 'password',
        roles: [Role.User],
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userDto)
        .expect(201);

      expect(response.body).toHaveProperty('username', userDto.username);
    });
  });

  describe('POST /auth/login', () => {
    it('should return an access token when login is successful', async () => {
      // Create a test user
      const userDto: UserDto = {
        username: 'testuser',
        password: 'password',
        roles: [Role.User],
      };
      await usersService.createUser(userDto);

      const loginData = {
        username: userDto.username,
        password: userDto.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
    });
  });

  describe('GET /profile', () => {
    it('should return the user profile', async () => {
      // Authenticate and get an access token
      const loginData = {
        username: 'testuser',
        password: 'password',
      };
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData);

      const accessToken = loginResponse.body.access_token;

      const response = await request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('username', 'testuser');
    });
  });

  // Add more test cases for other routes and functionalities

});
