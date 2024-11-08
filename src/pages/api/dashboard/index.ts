import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionUser } from '~/server/auth';
import si from 'systeminformation';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// Check if the request method is GET, if not return 405 Method Not Allowed
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	// Retrieve the session user based on the token from the request cookies
	const user = await getSessionUser(req.cookies.token as string);

	// If no user is found, return 401 Unauthorized
	if (!user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		// Get current CPU load
		const cpu = await si.currentLoad();

		// Get CPU temperature
		const temp = await si.cpuTemperature();

		// Get memory statistics
		const mem = await si.mem();

		// Get network statistics
		const net = await si.networkStats();
		// Get disk storage statistics
		const disk = await si.fsSize();

		// Create a dataset to return as the response, formatted for each system component
		const dataset = {
			processor: {
				// Current CPU usage percentage
				usage: cpu.currentLoad,

				// CPU temperature in Celsius
				temperature: temp.main
			},
			ram_memory: {
				// Percentage of active RAM usage
				usage: (mem.active / mem.total) * 100,

				// Free RAM in GB
				free: Number((mem.free / 1024 ** 3).toFixed(2))
			},
			network: net.map((net, index) => ({
				// Unique ID for the network interface
				id: `network-${index + 1}`,

				// Network interface name
				name: net.iface,

				// Download rate in MB/s
				download: Number((net.rx_sec / 1024 ** 2).toFixed(2)),

				// Upload rate in MB/s
				upload: Number((net.tx_sec / 1024 ** 2).toFixed(2))
			})),
			storage: disk.map((drive) => ({
				// Filesystem ID
				id: drive.fs,

				// Mount point for the partition
				name: drive.mount,

				// Corrected: Used storage percentage
				used: Number(((drive.used / drive.size) * 100).toFixed(2)),

				// Used storage in GB
				usage: Number((drive.used / 1024 ** 3).toFixed(2)),

				// Total storage in GB
				total: Number((drive.size / 1024 ** 3).toFixed(2))
			}))
		};

		// Return the formatted dataset as the response with a 200 OK status
		return res.status(200).json(dataset);
	} catch {
		// Handle any errors that occur during data fetching
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default handler;
