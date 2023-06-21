import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { HasRoles } from '../../decorators/has-roles.decorator';
import { Role } from '../../constants/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiTags('auth/login')
  @ApiBody({
    description: 'List of cats',
    type: UserDto,
    required:true,
  })
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiTags('auth/register')
  @ApiBody({
    description: 'List of cats',
    type: UserDto,
    required:true,
  })
  @Post('auth/register')
  async register(@Body() userDto: UserDto) {
    console.log("user",userDto);
    
    const createdUser = await this.usersService.createUser(userDto);
    console.log(createdUser);
    
    return createdUser;
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    example: 'Bearer your-token-here',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user);
    
    return req.user;
  }

  @HasRoles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  onlyAdmin(@Request() req) {
    return {message:"only admin",data:req.user};
  }

  @HasRoles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user')
  onlyUser(@Request() req) {
    return {message:"only user", data: req.user};
  }

  @HasRoles(Role.Accounting,Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('accounting')
  onlyAccounting(@Request() req) {
    return {message:"only accounting and admin",data:req.user};
  }
}
