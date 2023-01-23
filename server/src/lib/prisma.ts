import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient({
//   log: ['query'] // Faz o log das querys
// });

const prisma = new PrismaClient({ datasources: {  db: { url: `mysql://${process.env.DATABASE_URL}` } } });