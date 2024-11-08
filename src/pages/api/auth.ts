import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '~/server/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// Check if the request method is POST, if not return 405 Method Not Allowed
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	// Extract username and password from the request body
	const { username, password }: { username: string; password: string } = req.body;

	try {
		// Check if the user exists in the database by username
		const user = await db.user.findUnique({ where: { username } });
		if (!user) {
			// If the user doesn't exist, return 401 Unauthorized
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		// Compare the provided password with the stored hashed password
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			// If the passwords don't match, return 401 Unauthorized
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		// If the credentials are correct, generate a JWT token
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

		// Set the JWT token in an HttpOnly cookie with a 1-hour expiration
		res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

		// Return a 200 OK response with a success message and the token
		return res.status(200).json({ message: 'Login successful', token });
	} catch (error) {
		// Log any errors and return a 500 Internal Server Error response
		console.error('[api/auth.ts] Error during auth:', error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
