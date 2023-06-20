import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddNewRoleDto } from './dto/addnewrole.dto';
import { HasRoles } from '../../decorators/has-roles.decorator';
import { Role } from '../../constants/role.enum';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

@Controller("user")
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  
  @HasRoles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("add-role")
  async addUserRole(@Body() addNewRoleDto:AddNewRoleDto){
    const addRole = await this.usersService.addUserRole(addNewRoleDto.userId,addNewRoleDto.newRole)
    return addRole
  }
}
