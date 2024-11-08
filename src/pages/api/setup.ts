import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '~/server/db';
import bcrypt from 'bcrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// Check if the request method is POST, if not return 405 Method Not Allowed
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	// Check if any user accounts already exist in the database
	const accounts = await db.user.findMany();
	// If accounts exist, return 406 Not Acceptable with a setup success message
	if (accounts.length !== 0) return res.status(406).json({ message: 'Setup Is Successful' });

	// Extract the username and password from the request body
	const { username, password }: { username: string; password: string } = req.body;

	try {
		// Hash the provided password using bcrypt
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the new user in the database with the hashed password
		await db.user.create({
			data: {
				username,
				password: hashedPassword
			}
		});

		// Return a 200 OK response with a setup success message
		return res.status(200).json({ message: 'Setup successful' });
	} catch (error) {
		// Log any errors and return a 500 Internal Server Error response
		console.error('[api/setup.ts] Error during setup:', error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
