const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUser({ name, email, passwordHash }) {
  return prisma.user.create({
    data: { name, email, passwordHash },
  });
}

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

module.exports = { createUser, findUserByEmail };
