import type { Application } from '~/redux/desktopSlice';
import { AnimatePresence } from 'framer-motion';
import FileExplorer from './file-explorer';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
import Window from './window';

// Define a list of registered applications
export const registredApplications: Array<Application> = [
	{
		id: 'file-explorer',
		icon: '/desktop/applications/file-explorer.png',
		name: 'File Explorer',
		opened: false,
		tempData: {
			isFullScreen: false,
			height: 0,
			width: 0
		},
		component: FileExplorer
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
