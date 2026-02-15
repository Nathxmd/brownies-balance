import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@browniesbalance.com" },
    update: {},
    create: {
      email: "admin@browniesbalance.com",
      name: "Admin Brownies",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // 2. Create Categories
  const categories = [
    { name: "Best Sellers", slug: "best-sellers" },
    { name: "Gluten-Free", slug: "gluten-free" },
    { name: "Low Sugar", slug: "low-sugar" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("✅ Basic categories created");

  const bestSellers = await prisma.category.findUnique({ where: { slug: "best-sellers" } });
  const glutenFree = await prisma.category.findUnique({ where: { slug: "gluten-free" } });

  // 3. Create Sample Products
  const products = [
    {
      name: "Fudgy Original Brownies",
      slug: "fudgy-original-brownies",
      description: "Our signature 100% oat-based fudgy brownies. Perfectly balanced sweetness with premium dark chocolate.",
      price: 45000,
      stock: 50,
      categoryId: bestSellers!.id,
      thumbnail: "/hero_brownies_vibrant.png",
      tags: ["gluten-free", "low-sugar", "bestseller", "oat-based"],
      isAvailable: true,
      lowStockAlert: 5,
      isPreOrder: true,
      preOrderDays: 2,
    },
    {
      name: "Almond Crunch Brownies",
      slug: "almond-crunch-brownies",
      description: "Rich dark chocolate brownies topped with sliced toasted almonds for that extra crunch.",
      price: 55000,
      stock: 30,
      categoryId: bestSellers!.id,
      thumbnail: "/hero_brownies_vibrant.png",
      tags: ["gluten-free", "oat-based", "bestseller"],
      isAvailable: true,
      lowStockAlert: 5,
      isPreOrder: true,
      preOrderDays: 2,
    },
    {
      name: "Double Choco Chip",
      slug: "double-choco-chip",
      description: "For the ultimate chocolate lover. Packed with extra dark chocolate chips in every bite.",
      price: 50000,
      stock: 40,
      categoryId: glutenFree!.id,
      thumbnail: "/hero_brownies_vibrant.png",
      tags: ["gluten-free", "low-sugar", "oat-based"],
      isAvailable: true,
      lowStockAlert: 5,
      isPreOrder: true,
      preOrderDays: 2,
    },
    {
      name: "Walnut Wonder",
      slug: "walnut-wonder",
      description: "Classic combination of walnuts and chocolate. Nutty, fudgy, and absolutely delicious.",
      price: 60000,
      stock: 20,
      categoryId: glutenFree!.id,
      thumbnail: "/hero_brownies_vibrant.png",
      tags: ["gluten-free", "oat-based"],
      isAvailable: true,
      lowStockAlert: 5,
      isPreOrder: true,
      preOrderDays: 2,
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("✅ Sample products created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
