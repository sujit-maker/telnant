// src/devices/devices.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from '@prisma/client';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const lastDevice = await this.prisma.device.findFirst({
      orderBy: {
        id: 'desc',
      },
    });

    let newDeviceId = 'gateway-01';

    if (lastDevice && lastDevice.deviceId) {
      try {

        const lastDeviceNumber = parseInt(lastDevice.deviceId.split('-')[1] || '0', 10);

        const nextDeviceNumber = lastDeviceNumber + 1;
        newDeviceId = `gateway-${String(nextDeviceNumber).padStart(2, '0')}`;
      } catch (error) {
        console.error('Error generating new device ID:', error);
        throw new Error('Failed to generate device ID');
      }
    }

   
    return this.prisma.device.create({
      data: {
        deviceId: newDeviceId, 
        deviceName: createDeviceDto.deviceName,
        deviceType: createDeviceDto.deviceType,
        deviceIp: createDeviceDto.deviceIp,
        devicePort: createDeviceDto.devicePort,
        deviceUsername: createDeviceDto.deviceUsername,
        devicePassword: createDeviceDto.devicePassword,
      },
    });
  }

  async findAll(): Promise<Device[]> {
    return this.prisma.device.findMany();
  }

  async findOne(id: number): Promise<Device | null> {
    return this.prisma.device.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    return this.prisma.device.update({
      where: { id: Number(id) }, 
      data: updateDeviceDto,
    });
  }

  async remove(id: number) {

    const deviceId = Number(id);
  
    if (isNaN(deviceId)) {
      throw new NotFoundException(`Invalid device ID: ${id}`);
    }
  
    const device = await this.prisma.device.findUnique({ where: { id: deviceId } });
  
    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }
  
    await this.prisma.device.delete({ where: { id: deviceId } });
    return { message: `Device with ID ${deviceId} deleted successfully` };
  }
  
}
