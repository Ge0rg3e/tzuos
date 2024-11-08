import { Button } from '~/views/components/ui/button';
import Container from '~/views/layout/container';
import { type Session } from '~/server/auth';
import { swrFetcher } from '~/utils/helpers';
import { LuMonitor } from 'react-icons/lu';
import { useRouter } from 'next/router';
import useSWR from 'swr';

// Components
import SystemStatus from './components/SystemStatus';
import Header from './components/Header';

const Dashboard = ({ session }: { session: Session }) => {
	const router = useRouter();
	const { data } = useSWR('/api/dashboard', swrFetcher, { refreshInterval: 500 });

	return (
		<Container loading={!data} session={session}>
			<Header />

			<div className="p-14 space-y-6 ">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
					<Button onClick={() => router.push('/?desktop')}>
						<LuMonitor /> Desktop
					</Button>
				</div>

				<SystemStatus data={data} />
			</div>
		</Container>
	);
};

export default Dashboard;
