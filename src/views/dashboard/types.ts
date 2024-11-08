export interface DashboardData {
	processor: {
		usage: number;
		temperature: number | null;
	};
	ram_memory: {
		usage: number;
		free: number;
	};
	network: Array<{
		id: string;
		name: string;
		download: number;
		upload: number;
	}>;
	storage: Array<{
		id: string;
		name: string;
		used: number;
		usage: number;
		total: number;
	}>;
}
