import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionUser } from '~/server/auth';
import si from 'systeminformation';
import path from 'path';
import fs from 'fs';

// Helper function to get a valid directory path
const getValidPath = (dirPath: string | undefined) => (dirPath && fs.existsSync(dirPath) ? dirPath : process.env.HOME || '/home');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// Handle GET request
	if (req.method === 'GET') {
		try {
			// Retrieve the list of users using systeminformation library
			const users = await si.users();

			// Get the home directory of the first user (or default to '/home')
			const homeDir = users[0]?.user || '/home';

			// Return the home directory path in the response
			return res.status(200).json({ rootPath: homeDir });
		} catch (error) {
			// Log the error and return a 500 Internal Server Error response
			console.error('Error getting user info:', error);
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	}

	// Check if the request is authorized
	const user = await getSessionUser(req.cookies.token as string);
	if (!user) return res.status(401).json({ message: 'Unauthorized' });

	// Extract the requested path from the request body
	const { path: reqPath } = req.body;

	// If the path is not provided, return a 400 Bad Request response
	if (!reqPath) return res.status(400).json({ message: 'Path is required' });

	try {
		// Get the valid path by ensuring the requested path exists
		const validPath = getValidPath(reqPath);

		// Read the directories from the valid path, filtering out non-directory entries
		const folders = fs
			.readdirSync(validPath, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory()) // Only keep directories
			.map((dirent) => ({
				// Format folder information to include name and full path
				name: dirent.name,
				path: path.join(validPath, dirent.name)
			}));

		// Return the list of directories in the response
		return res.status(200).json({ folders });
	} catch {
		// Return a 500 Internal Server Error response if there's an issue reading the directory
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
