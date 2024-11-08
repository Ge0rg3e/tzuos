import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionUser } from '~/server/auth';
import { exec } from 'child_process';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// Check if the request method is POST, if not return 405 Method Not Allowed
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	// Check if the request is authorized
	const user = await getSessionUser(req.cookies.token as string);
	if (!user) return res.status(401).json({ message: 'Unauthorized' });

	try {
		// Execute the reboot command with elevated privileges
		exec('sudo reboot', (error, stdout, stderr) => {
			if (error) {
				return res.status(500).json({ message: 'Internal Server Error', error: error.message });
			}
			if (stderr) {
				return res.status(500).json({ message: 'Internal Server Error', error: stderr });
			}
			// Send a response confirming the reboot command was initiated
			return res.status(200).json({ message: 'System reboot initiated.' });
		});
	} catch (err) {
		// Return a 500 Internal Server Error response if there's an unexpected issue
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
