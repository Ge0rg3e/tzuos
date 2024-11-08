import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { openApp } from '~/redux/desktopSlice';
import Taskbar from './components/Taskbar';
import Applications from './applications';
import { RootState } from '~/redux/store';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Desktop = () => {
	const applications = useSelector((state: RootState) => state.desktop.applications);
	const dispatch = useDispatch();

	// Get the current route's pathname and query parameters
	const { pathname, query, replace } = useRouter();

	// Determine if the desktop should be shown based on the URL query
	const isShowing = pathname === '/' && query.desktop !== undefined;

	const closeDesktop = () => {
		delete query.desktop;
		replace({ pathname: pathname, query }, undefined, { shallow: true });
	};

	useEffect(() => {
		if (isShowing) {
			// Create a new audio object and play the startup sound
			const audio = new Audio('/desktop/sounds/startup.mp3');

			// Set volume
			audio.volume = 0.04;

			// Log an error if playback fails
			audio.play().catch((error) => console.error('Failed Startup Audio playback', error));
		}
	}, [isShowing]);

	return (
		<AnimatePresence>
			{isShowing && (
				<motion.div
					className="w-screen h-screen fixed bg-[url('/desktop/wallpapers/dark-1.jpg')] bg-cover bg-center overflow-hidden select-none z-[999]"
					transition={{ duration: 0.5, ease: 'easeInOut' }}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0, opacity: 0 }}
				>
					{/* Close Desktop Mode */}
					<button
						className="fixed top-3 right-3 size-[30px] flex justify-center items-center smooth bg-red-400/40 backdrop-blur-md opacity-0 rounded-full hover:opacity-100"
						title="Close Desktop Mode"
						onClick={closeDesktop}
					>
						<IoClose />
					</button>

					{/* Desktop Apps */}
					<div className="flex flex-col gap-5 p-5">
						{applications.map((app) => (
							<button
								className="size-[85px] flex flex-col justify-between items-center gap-y-1 smooth py-2 rounded-lg hover:bg-black/20"
								onClick={() => dispatch(openApp(app.id))}
								key={app.id}
							>
								<div className="size-[45px] flex justify-center items-center rounded-lg" style={{ backgroundColor: app.icon.color }}>
									<app.icon.content size={30} />
								</div>
								<div className="text-sm text-muted-foreground">{app.name}</div>
							</button>
						))}
					</div>

					<Applications />
					<Taskbar />
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Desktop;
