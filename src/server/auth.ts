import jwt from 'jsonwebtoken';
import { db } from './db';

// Define the Session type to represent the authenticated user's data (or null if no session exists)
export type Session = { id: string; username: string; password: string } | null;

// Function to get the session user by verifying the provided JWT token
export const getSessionUser = async (token: string) => {
	// If no token is provided, return null as there's no authenticated session
	if (!token) return null;

	try {
		// Verify the JWT token using the secret key and decode the payload
		// The decoded payload should contain the userId
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

		// Fetch the user from the database using the decoded userId
		const user = await db.user.findUnique({ where: { id: decoded.userId } });

		// Return the user if found, otherwise null
		return user;
	} catch {
		// Return null if an error occurs during token verification
		return null;
	}
};
