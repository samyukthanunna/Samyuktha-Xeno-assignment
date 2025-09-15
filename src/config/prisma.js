// A centralized Prisma Client instance to be used across the application.
// This prevents creating too many connections to the database.
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();