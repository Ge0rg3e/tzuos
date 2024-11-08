import { motion, AnimatePresence } from 'framer-motion';
import Taskbar from './components/Taskbar';
import Applications from './applications';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Desktop = () => {
	// Get the current route's pathname and query parameters
	const { pathname, query } = useRouter();

	// Determine if the desktop should be shown based on the URL query
	const isShowing = pathname === '/' && query.desktop !== undefined;

	useEffect(() => {
		if (isShowing) {
			// Create a new audio object and play the startup sound
			const audio = new Audio('/desktop/sounds/startup.mp3');

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
					<Applications />
					<Taskbar />
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Desktop;
