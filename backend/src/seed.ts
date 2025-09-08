import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const menuItems = [
  {
    name: "French Toast",
    description: "Classic French toast with maple syrup",
    price: 12.99,
    category: "BREAKFAST",
    image: "/images/foods/french_toast.jpeg",
    isFeatured: true
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with caesar dressing",
    price: 10.99,
    category: "LUNCH",
    image: "/images/foods/caesar_salad.jpg"
  },
  {
    name: "Chicken Wings",
    description: "Crispy chicken wings with your choice of sauce",
    price: 14.99,
    category: "LUNCH",
    image: "/images/foods/chicken_wings.jpg",
    isFeatured: true
  },
  {
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter",
    price: 6.99,
    category: "STARTERS",
    image: "/images/foods/garlic_bread.jpeg"
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert",
    price: 8.99,
    category: "DESSERTS",
    image: "/images/foods/tiramisu.jpeg"
  },
  {
    name: "Eggs Benedict",
    description: "Poached eggs with hollandaise sauce",
    price: 13.99,
    category: "BREAKFAST",
    image: "/images/foods/eggs_benedict.jpg",
    isFeatured: true
  },
  {
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella sticks",
    price: 7.99,
    category: "STARTERS",
    image: "/images/foods/mozzarella_sticks.jpeg"
  },
  {
    name: "Pasta Alfredo",
    description: "Creamy pasta with parmesan sauce",
    price: 15.99,
    category: "LUNCH",
    image: "/images/foods/pasta_alfredo.jpg",
    isFeatured: true
  },
  {
    name: "Chocolate Cake",
    description: "Rich chocolate layer cake",
    price: 6.99,
    category: "DESSERTS",
    image: "/images/foods/chocolate_cake.jpg"
  },
  {
    name: "Spring Rolls",
    description: "Crispy vegetable spring rolls",
    price: 8.99,
    category: "STARTERS",
    image: "/images/foods/spring_rolls.jpg"
  },
  {
    name: "Iced Coffee",
    description: "Chilled coffee with ice and milk",
    price: 5.99,
    category: "BEVERAGES",
    image: "/images/foods/iced_coffee.jpeg"
  },
  {
    name: "Ice Cream Sundae",
    description: "Classic ice cream sundae with toppings",
    price: 6.99,
    category: "BEVERAGES",
    image: "/images/foods/icecreamsundae.jpg"
  },
  {
    name: "Mango Smoothie",
    description: "Fresh mango smoothie",
    price: 5.49,
    category: "BEVERAGES",
    image: "/images/foods/mangosmoothie.jpg"
  },
  {
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 4.99,
    category: "BEVERAGES",
    image: "/images/foods/freshorangejuice.jpeg"
  },
  {
    name: "Strawberry Milkshake",
    description: "Creamy strawberry milkshake",
    price: 5.99,
    category: "BEVERAGES",
    image: "/images/foods/strawberry_milkshake.jpg"
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@perlas.com' },
    update: {},
    create: {
      email: 'admin@perlas.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+1234567890'
    }
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
      phone: '+1234567891'
    }
  });

  console.log('✅ Sample customer created:', customer.email);

  // Create menu items
  console.log('🍽️ Creating menu items...');
  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { name: item.name },
      update: item,
      create: item
    });
  }

  console.log(`✅ Created ${menuItems.length} menu items`);

  // Create sample booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 0, 0, 0);

  const sampleBooking = await prisma.booking.create({
    data: {
      userId: customer.id,
      date: tomorrow,
      time: '19:00',
      partySize: 4,
      specialRequests: 'Window table preferred',
      status: 'CONFIRMED'
    }
  });

  console.log('✅ Sample booking created:', sampleBooking.id);

  // Create sample order
  const menuItem1 = await prisma.menuItem.findFirst({ where: { name: 'French Toast' } });
  const menuItem2 = await prisma.menuItem.findFirst({ where: { name: 'Iced Coffee' } });

  if (menuItem1 && menuItem2) {
    const sampleOrder = await prisma.order.create({
      data: {
        userId: customer.id,
        totalAmount: 18.98,
        status: 'CONFIRMED',
        paymentMethod: 'CARD',
        specialInstructions: 'Extra syrup on the French toast'
      }
    });

    await prisma.orderItem.createMany({
      data: [
        {
          orderId: sampleOrder.id,
          menuItemId: menuItem1.id,
          quantity: 1,
          price: menuItem1.price
        },
        {
          orderId: sampleOrder.id,
          menuItemId: menuItem2.id,
          quantity: 2,
          price: menuItem2.price
        }
      ]
    });

    console.log('✅ Sample order created:', sampleOrder.id);
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin: admin@perlas.com / admin123');
  console.log('Customer: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });