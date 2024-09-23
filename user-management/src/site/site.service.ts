import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SiteService {
  constructor(private prisma: PrismaService) {}

  // Create a new Site
  async create(createSiteDto: CreateSiteDto) {
    const { customerId, siteName, siteAddress, contactName, contactNumber, contactEmail } = createSiteDto;

    // Ensure customerId is provided and valid
    if (!customerId) {
      throw new BadRequestException('customerId is required');
    }

    // Check if the customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} does not exist.`);
    }

    // Create the site and associate it with the customer
    return this.prisma.site.create({
      data: {
        customer: {
          connect: { id: customerId },
        },
        siteName,
        siteAddress,
        contactName,
        contactNumber,
        contactEmail,
      },
    });
  }

  // Fetch All Sites with Customer Names
  async findAll() {
    return this.prisma.site.findMany({
      include: {
        customer: {
          select: {
            customerName: true,  // Only select the customerName from the Customer model
          },
        },
      },
    });
  }

  // Fetch a Specific Site by ID with Customer Name
  async findOne(id: number) {
    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            customerName: true,  // Include the customerName when fetching the site
          },
        },
      },
    });

    // Handle case where the site is not found
    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found.`);
    }

    return site;
  }

  // Update a Site
  async update(id: number, updateSiteDto: UpdateSiteDto) {
    const { customerId, siteName, siteAddress, contactName, contactNumber, contactEmail } = updateSiteDto;

    // Check if the customer exists if customerId is provided
    if (customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} does not exist.`);
      }
    }

    // Update the site and connect to a new customer if customerId is provided
    return this.prisma.site.update({
      where: { id },
      data: {
        siteName,
        siteAddress,
        contactName,
        contactNumber,
        contactEmail,
        customer: customerId
          ? {
              connect: { id: customerId },
            }
          : undefined, // Only connect customer if customerId is provided
      },
    });
  }

  // Delete a Site
  async remove(id: number) {
    const site = await this.prisma.site.findUnique({
      where: { id },
    });

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} does not exist.`);
    }

    return this.prisma.site.delete({
      where: { id },
    });
  }
}
