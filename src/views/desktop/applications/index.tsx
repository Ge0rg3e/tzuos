import type { Application } from '~/redux/desktopSlice';
import { AnimatePresence } from 'framer-motion';
import { LuFolder } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import Window from './window';

// Apps
import Files from './files';

// Define a list of registered applications
export const registredApplications: Array<Application> = [
	{
		id: 'files',
		icon: {
			color: '#58AAFF',
			content: LuFolder
		},
		name: 'Files',
		opened: false,
		tempData: {
			isFullScreen: false,
			height: 0,
			width: 0
		},
		component: Files
	}
];

const Applications = () => {
	// Access the current applications
	const applications = useSelector((state: RootState) => state.desktop.applications);

	return (
		<AnimatePresence>
			{applications
				.filter((app) => app.opened)
				.map((app) => (
					<Window key={app.id} id={app.id} name={app.name}>
						<app.component />
					</Window>
				))}
		</AnimatePresence>
	);
};

export default Applications;
