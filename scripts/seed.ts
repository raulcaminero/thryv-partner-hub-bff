import { DataSource } from 'typeorm';
import { Customer, CustomerGender, CustomerStatus } from '../src/modules/customer/entities/customer.entity';

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.development' });

async function seedPostgreSQL() {
  console.log('🌱 Seeding PostgreSQL database...');

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Customer],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to PostgreSQL');

    const customerRepository = dataSource.getRepository(Customer);

    // Clear existing data
    await customerRepository.clear();

    // Sample customers
    const customers = [
      {
        identification: '12345678901',
        name: 'John',
        lastname: 'Doe',
        dateBorn: new Date('1990-01-15'),
        gender: CustomerGender.MALE,
        status: CustomerStatus.ACTIVE,
      },
      {
        identification: '23456789012',
        name: 'Jane',
        lastname: 'Smith',
        dateBorn: new Date('1985-03-20'),
        gender: CustomerGender.FEMALE,
        status: CustomerStatus.ACTIVE,
      },
      {
        identification: '34567890123',
        name: 'Bob',
        lastname: 'Johnson',
        dateBorn: new Date('1992-07-10'),
        gender: CustomerGender.MALE,
        status: CustomerStatus.PENDING,
      },
    ];

    for (const customerData of customers) {
      const customer = customerRepository.create(customerData);
      await customerRepository.save(customer);
    }

    console.log(`✅ Seeded ${customers.length} customers in PostgreSQL`);
  } catch (error) {
    console.error('❌ PostgreSQL seeding failed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

async function main() {
  console.log('🚀 Starting database seeding process...');

  try {
    await seedPostgreSQL();
    console.log('🎉 Seeding completed!');
  } catch (error) {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  }
}

// Run the seeding process
if (require.main === module) {
  main();
}