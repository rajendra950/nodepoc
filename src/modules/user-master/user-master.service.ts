import { PrismaClient } from '@prisma/client';
import { UserMasterResponse } from './dto/user-master.dto';

export class UserMasterService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get 5 dummy/sample records from user_master table
   */
  async getDummyRecords(): Promise<UserMasterResponse[]> {
    const records = await this.prisma.userMaster.findMany({
      take: 5,
      orderBy: {
        user_id: 'asc',
      },
    });

    return records;
  }

  /**
   * Get all records with pagination
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.userMaster.findMany({
        skip,
        take: limit,
        orderBy: {
          creation_date: 'desc',
        },
      }),
      this.prisma.userMaster.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get record by ID
   */
  async findById(id: number): Promise<UserMasterResponse | null> {
    return this.prisma.userMaster.findUnique({
      where: { user_id: id },
    });
  }

  /**
   * Create sample/dummy records for testing
   */
  async createDummyRecords() {
    const dummyData = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        is_active: true,
        modification_date: new Date(),
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        is_active: true,
        modification_date: new Date(),
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        is_active: true,
        modification_date: new Date(),
      },
      {
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        is_active: false,
        modification_date: new Date(),
      },
      {
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        is_active: true,
        modification_date: new Date(),
      },
    ];

    const records = [];
    for (const data of dummyData) {
      try {
        const record = await this.prisma.userMaster.upsert({
          where: { email: data.email },
          update: data,
          create: data,
        });
        records.push(record);
      } catch (error) {
        console.log(`Record with email ${data.email} might already exist, skipping...`);
      }
    }

    return records;
  }
}

