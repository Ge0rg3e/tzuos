import { PrismaClient } from '@prisma/client';

// Function to create and configure a new PrismaClient instance
const createPrismaClient = () =>
	// Return a new PrismaClient instance with logging settings based on the environment
	new PrismaClient({
		// In development, log queries, errors, and warnings; in production, only log errors
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
	});

// Declare a global object to hold the Prisma client for reuse across the application
const globalForPrisma = globalThis as unknown as {
	prisma: ReturnType<typeof createPrismaClient> | undefined; // Type the global `prisma` property
};

// Initialize the Prisma client (if it's not already initialized, create a new instance)
export const db = globalForPrisma.prisma ?? createPrismaClient(); // Reuse the client if available, otherwise create a new one

// In non-production environments, store the Prisma client globally for faster access in future requests
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
