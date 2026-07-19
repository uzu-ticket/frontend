import { PrismaClient } from "@prisma/client";
import { uuidv7 } from "uuidv7";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Concerts", slug: "concerts" },
  { name: "Comedy", slug: "comedy" },
  { name: "Tech", slug: "tech" },
  { name: "Faith", slug: "faith" },
  { name: "Sports", slug: "sports" },
  { name: "Nightlife", slug: "nightlife" },
];

async function main() {
  for (const category of CATEGORIES) {
    await prisma.eventCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: { id: uuidv7(), ...category },
    });
  }

  const devEmail = "dev@uzuticket.com";
  const existing = await prisma.user.findUnique({ where: { email: devEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        id: uuidv7(),
        email: devEmail,
        fullName: "Dev Organiser",
        passwordHash,
        isEmailVerified: true,
      },
    });

    const org = await prisma.organisation.create({
      data: {
        id: uuidv7(),
        name: "Dev Organisation",
        slug: "dev-organisation",
        contactEmail: devEmail,
        createdBy: user.id,
      },
    });

    await prisma.organisationMember.create({
      data: {
        id: uuidv7(),
        organisationId: org.id,
        userId: user.id,
        role: "super_admin",
        acceptedAt: new Date(),
      },
    });

    // eslint-disable-next-line no-console
    console.log(`Seeded dev user ${devEmail} / password123, org "${org.slug}"`);
  }

  // eslint-disable-next-line no-console
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
