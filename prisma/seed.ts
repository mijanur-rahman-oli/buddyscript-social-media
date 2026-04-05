// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const dylan = await prisma.user.upsert({
    where: { email: "dylan@buddyscript.com" },
    update: {},
    create: {
      firstName: "Dylan",
      lastName: "Field",
      email: "dylan@buddyscript.com",
      password: hashedPassword,
    },
  });

  const steve = await prisma.user.upsert({
    where: { email: "steve@buddyscript.com" },
    update: {},
    create: {
      firstName: "Steve",
      lastName: "Jobs",
      email: "steve@buddyscript.com",
      password: hashedPassword,
    },
  });

  const ryan = await prisma.user.upsert({
    where: { email: "ryan@buddyscript.com" },
    update: {},
    create: {
      firstName: "Ryan",
      lastName: "Roslansky",
      email: "ryan@buddyscript.com",
      password: hashedPassword,
    },
  });

  // Create demo posts
  const post1 = await prisma.post.create({
    data: {
      text: "Just launched the new Healthy Tracking App! 🎉 Check it out and let me know what you think. Excited to share this with the community!",
      visibility: "PUBLIC",
      authorId: dylan.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      text: "Design is not just what it looks like and feels like. Design is how it works. 🍎",
      visibility: "PUBLIC",
      authorId: steve.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      text: "The future of professional connections is here. Excited to see what our community builds together. 🚀",
      visibility: "PUBLIC",
      authorId: ryan.id,
    },
  });

  // Likes
  await prisma.like.createMany({
    data: [
      { userId: steve.id, postId: post1.id },
      { userId: ryan.id, postId: post1.id },
      { userId: dylan.id, postId: post2.id },
      { userId: ryan.id, postId: post2.id },
    ],
    skipDuplicates: true,
  });

  // Comments
  const comment1 = await prisma.comment.create({
    data: {
      text: "This is incredible! The UI is so clean and intuitive. Great work Dylan! 🙌",
      authorId: steve.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: "Totally agree with Steve. The onboarding flow is especially impressive.",
      authorId: ryan.id,
      postId: post1.id,
      parentId: comment1.id, // nested reply
    },
  });

  await prisma.comment.create({
    data: {
      text: "Couldn't agree more. Simple yet powerful is always the right choice.",
      authorId: ryan.id,
      postId: post2.id,
    },
  });

  console.log("✅ Seed complete!");
  console.log("\nDemo accounts (password: password123):");
  console.log("  dylan@buddyscript.com");
  console.log("  steve@buddyscript.com");
  console.log("  ryan@buddyscript.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });