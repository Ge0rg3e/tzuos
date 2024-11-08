import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// Check if the request method is POST, if not return 405 Method Not Allowed
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	// Clear the 'token' cookie by setting its Max-Age to 0 and marking it HttpOnly
	res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0`);

	// Return a 200 OK response with a logout success message
	return res.status(200).json({ message: 'Logout successful' });
};

export default handler;
