import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  InternalServerErrorException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from './user.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService, // Inject AuthService
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('managers')
  async findManagers() {
    try {
      return await this.userService.findManagers();
    } catch (error) {
      console.error('Error in findManagers controller:', error);
      throw new InternalServerErrorException('Failed to fetch managers.');
    }
  }

  

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      return await this.userService.findOne(idNumber);
    } catch (error) {
      console.error('Error in findOne controller:', error);
      throw new InternalServerErrorException('Failed to fetch user.');
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.update(Number(id), updateUserDto);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Failed to update user.');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.userService.remove(Number(id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('Failed to delete user.');
    }
  }

 
  // @Get('executives')
  // async findExecutivesByManager(@Query('managerId') managerId: string) {
  //   console.log('Received managerId:', managerId); // Log the raw input

  //   // Check if managerId is provided
  //   if (!managerId || managerId.trim() === '') {
  //     throw new BadRequestException('Manager ID is required');
  //   }

  //   // Convert managerId to a number
  //   const managerIdNumber = parseInt(managerId.trim(), 10);
  //   console.log('Parsed managerId as:', managerIdNumber); // Log parsed value

  //   // Validate if managerId is a number and is greater than 0
  //   if (isNaN(managerIdNumber) || managerIdNumber <= 0) {
  //     throw new BadRequestException('Invalid manager ID format');
  //   }

  //   try {
  //     const executives = await this.userService.findExecutivesByManager(managerIdNumber);
  //     console.log('Fetched executives:', executives); // Log the fetched executives
  //     return executives; // Return the fetched executives
  //   } catch (error) {
  //     console.error('Error fetching executives:', error);
  //     throw new InternalServerErrorException('An error occurred while fetching executives');
  //   }
  // }
  

  @Patch(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.authService.changePassword(userId, changePasswordDto.newPassword, changePasswordDto.confirmPassword);
  }


  @Post('exe')
  async createExecutive(
    @Body() createExecutiveDto: CreateUserDto,
    @User() user: any,
  ) {
    // Add managerId to the DTO
    createExecutiveDto.managerId = user.id;
    try {
      return await this.userService.createUser(createExecutiveDto, createExecutiveDto.managerId);
    } catch (error) {
      console.error('Error creating executive:', error);
      throw new InternalServerErrorException('Failed to create executive.');
    }
  }
  


}  
