//  1. Purpose
//     Fills the database with the starter roles and permissions that
//     the app needs to work. Without this, a new user can't be given
//     a role because no roles exist yet.
//
//  2. Key Terms and Definitions
//     upsert  - "update or insert". If a row with this name already
//               exists, leave it alone; if not, create it. This way
//               we can safely run the seed file more than once
//               without making duplicates.
//     connect - tells Prisma to link an existing row to another row.
//               Here we use it to attach permissions to roles.
//  3. Inputs
//     - Connection to the database, from DATABASE_URL
//
//  4. Output
//     - Two roles in the database: ROLE_USER and ROLE_ADMIN
//     - Three permissions: USER_READ, ADMIN_READ, ADMIN_WRITE
//     - ROLE_USER  has  USER_READ
//       ROLE_ADMIN has  USER_READ, ADMIN_READ, ADMIN_WRITE
//
//  Plan
//  1. Make a Prisma client to talk to the database
//  2. Create (or skip if already there) the three permissions
//  3. Create the ROLE_USER role and attach USER_READ to it
//  4. Create the ROLE_ADMIN role and attach all three permissions
//  5. Print a message so we know it worked
//  6. Disconnect from the database when finished
// 

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // Step 1: make the permissions first since the roles need to link to them
  const userRead = await prisma.permission.upsert({
    where: { name: 'USER_READ' },
    update: {},
    create: { name: 'USER_READ' },
  });

  const adminRead = await prisma.permission.upsert({
    where: { name: 'ADMIN_READ' },
    update: {},
    create: { name: 'ADMIN_READ' },
  });

  const adminWrite = await prisma.permission.upsert({
    where: { name: 'ADMIN_WRITE' },
    update: {},
    create: { name: 'ADMIN_WRITE' },
  });

  console.log('Permissions are ready');

  // Step 2: make the regular user role and give it USER_READ
  await prisma.role.upsert({
    where: { name: 'ROLE_USER' },
    update: {},
    create: {
      name: 'ROLE_USER',
      permissions: {
        connect: [{ id: userRead.id }],
      },
    },
  });

  // Step 3: make the admin role and give it everything
  await prisma.role.upsert({
    where: { name: 'ROLE_ADMIN' },
    update: {},
    create: {
      name: 'ROLE_ADMIN',
      permissions: {
        connect: [
          { id: userRead.id },
          { id: adminRead.id },
          { id: adminWrite.id },
        ],
      },
    },
  });

  console.log('Roles are ready');
  console.log('Done seeding!');
}

main()
  .catch((err) => {
    console.error('Something went wrong while seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
