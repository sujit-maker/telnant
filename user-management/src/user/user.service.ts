import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, usertype, managerId } = createUserDto;

    // Check if username already exists
    const userExists = await this.prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        usertype,
        manager: usertype === UserType.EXECUTIVE && managerId ? { connect: { id: managerId } } : undefined,
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        usertype: true,
        managerId: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        usertype: true,
        managerId: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findManagers() {
    return this.prisma.user.findMany({
      where: { usertype: UserType.MANAGER },
      select: { id: true, username: true },
    });
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const hashedPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : user.password;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        username: updateUserDto.username ?? user.username,
        usertype: updateUserDto.usertype ?? user.usertype,
        password: hashedPassword,
        managerId: updateUserDto.managerId ?? user.managerId,
      },
    });

    return updatedUser;
  }


  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: `User with ID ${id} deleted successfully` };
  }




  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }



  async changePassword(userId: number, newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
  
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update password');
    }
  
    return { message: 'Password updated successfully' };
  }
  
  

  
  // async findExecutivesByManager(managerId: number) {
  //   const executives = await this.prisma.user.findMany({
  //     where: {
  //       managerId: managerId, // Filter by managerId
  //       usertype: UserType.EXECUTIVE, // Ensure the user is an EXECUTIVE
  //     },
  //     select: {
  //       id: true,
  //       username: true, // Optionally include other fields if needed
  //     },
  //   });

  //   if (executives.length === 0) {
  //     console.log(`No executives found for manager ID ${managerId}`);
  //   }

  //   return executives; // Return the fetched executives
  // }

  

  async createUser(createUserDto: CreateUserDto, managerId: number) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        usertype: 'EXECUTIVE',
        managerId,
      },
    });
  }

}
