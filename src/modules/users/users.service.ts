import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUser } from '../../interfaces/user.entity';
import { UserDto } from '../auth/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async findOne(username: string): Promise<IUser | undefined> {
    const findUser = this.userRepository.findOne({
      where: { username: username },
    });
    return findUser;
  }
  async createUser(userDto: UserDto) {
   try {
    
   
    const user = this.userRepository.create(userDto);
    const saveUser = await this.userRepository.save(user);
    return saveUser;
  } catch (error) {
   console.log();
   throw new InternalServerErrorException 
  }
  }
  async getUserById(Id: number) {
    const userId = await this.userRepository.findBy({ userId: Id });
    return userId;
  }

  async addUserRole(userId, newRole) {
    try {
      
    const user = await this.getUserById(userId);
    
    if (user.length === 0) {
      return {message:"user doesn't exist"};
    }
    const updateUser =await this.userRepository.update(
      { userId: userId },
      { roles: newRole },
    );
    if(updateUser.affected===1){
      return {message:"seccussfuly update"}
    }
    console.log(updateUser);
    
    return updateUser;
  } catch (err) {
   console.log(err);
   throw new InternalServerErrorException 
  }
  }
}
