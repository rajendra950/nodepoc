import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../common/utils/password.utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create roles
  console.log('Creating roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator with full access',
      permissions: [
        'user:read',
        'user:write',
        'user:delete',
        'role:read',
        'role:write',
        'role:delete',
      ],
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'Regular user with basic access',
      permissions: ['user:read'],
    },
  });

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'MODERATOR' },
    update: {},
    create: {
      name: 'MODERATOR',
      description: 'Moderator with elevated access',
      permissions: ['user:read', 'user:write'],
    },
  });

  console.log('✅ Roles created');

  // Create admin user
  console.log('Creating admin user...');
  const adminPassword = await hashPassword('Admin@123');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      isEmailVerified: true,
      provider: 'LOCAL',
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('✅ Admin user created');

  // Create test user
  console.log('Creating test user...');
  const userPassword = await hashPassword('User@123');
  
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
      isEmailVerified: true,
      provider: 'LOCAL',
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: testUser.id,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      roleId: userRole.id,
    },
  });

  console.log('✅ Test user created');

  console.log('🎉 Database seeding completed!');
  console.log('\n📝 Test credentials:');
  console.log('Admin: admin@example.com / Admin@123');
  console.log('User: user@example.com / User@123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


