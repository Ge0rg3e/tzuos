import { closeApp, setAppTempData } from '~/redux/desktopSlice';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { motion } from 'framer-motion';

interface Props {
	id: string;
	name: string;
	children: FixableAny;
}

// Define the minimum dimensions for the window
const minDimension = { width: 968, height: 559 };

const Window = ({ id, name, children }: Props) => {
	// State to hold the window's current dimensions and position
	const [dimensions, setDimensions] = useState(minDimension);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isFullScreen, setIsFullScreen] = useState(false);

	// Reference to the window element
	const windowRef = useRef<HTMLDivElement>(null);

	// Offset for dragging calculation
	const offset = useRef({ x: 0, y: 0 });

	// Track if the window is being dragged
	const isDragging = useRef(false);

	// Track if the window is being resized
	const isResizing = useRef(false);

	// Access Redux dispatch function
	const dispatch = useDispatch();

	useEffect(() => {
		// Center the window vertically
		const initialY = (window.innerHeight - minDimension.height) / 2;

		// Center the window horizontally
		const initialX = (window.innerWidth - minDimension.width) / 2;

		setPosition({ x: initialX, y: initialY });

		// Dispatch initial window dimensions to Redux
		dispatch(setAppTempData({ id, updates: { width: minDimension.width, height: minDimension.height, isFullScreen: false } }));
	}, [dispatch, id]);

	// Function to close the window and remove it from the desktop
	const onClose = () => dispatch(closeApp(id));

	// Function to toggle full-screen mode for the window
	const onFullScreen = () => {
		// Set new dimensions for full-screen or revert back to the original dimensions
		const newDimensions = isFullScreen ? minDimension : { width: window.innerWidth, height: window.innerHeight };
		const newPosition = isFullScreen ? { x: (window.innerWidth - minDimension.width) / 2, y: (window.innerHeight - minDimension.height) / 2 } : { x: 0, y: 0 };

		// Update window dimensions
		setDimensions(newDimensions);

		// Update window position
		setPosition(newPosition);

		// Toggle full-screen state
		setIsFullScreen(!isFullScreen);

		// Dispatch the updated window state to Redux store
		dispatch(setAppTempData({ id, updates: { isFullScreen: !isFullScreen, width: newDimensions.width, height: newDimensions.height } }));
	};

	// Handle mouse down event to initiate dragging of the window
	const handleMouseDownDrag = (e: React.MouseEvent) => {
		if (!isFullScreen) {
			// Start dragging
			isDragging.current = true;

			// Calculate the offset for dragging
			offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };

			// Add mousemove event listener to track dragging
			window.addEventListener('mousemove', handleMouseMoveDrag);

			// Add mouseup event listener to stop dragging
			window.addEventListener('mouseup', handleMouseUpDrag);
		}
	};

	// Handle window dragging by updating the position of the window
	const handleMouseMoveDrag = (e: MouseEvent) => {
		if (isDragging.current && windowRef.current) {
			// Clamp the window position within the screen bounds
			const clampedX = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - windowRef.current.offsetWidth));
			const clampedY = Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - windowRef.current.offsetHeight));

			setPosition({ x: clampedX, y: clampedY }); // Update window position
		}
	};

	// Stop dragging the window
	const handleMouseUpDrag = () => {
		if (isDragging.current) {
			// End dragging
			isDragging.current = false;

			// Remove mousemove event listener
			window.removeEventListener('mousemove', handleMouseMoveDrag);

			// Remove mouseup event listener
			window.removeEventListener('mouseup', handleMouseUpDrag);
		}
	};

	// Start resizing the window
	const handleMouseDownResize = () => {
		// Start resizing
		isResizing.current = true;

		// Add mousemove event listener to track resizing
		window.addEventListener('mousemove', handleMouseMoveResize);

		// Add mouseup event listener to stop resizing
		window.addEventListener('mouseup', handleMouseUpResize);
	};

	// Handle window resizing by updating the window's dimensions
	const handleMouseMoveResize = (e: MouseEvent) => {
		if (isResizing.current && windowRef.current) {
			// Set new dimensions, ensuring the window doesn't shrink below the minimum size
			const newWidth = Math.max(minDimension.width, e.clientX - windowRef.current.getBoundingClientRect().left);
			const newHeight = Math.max(minDimension.height, e.clientY - windowRef.current.getBoundingClientRect().top);

			// Update window dimensions
			setDimensions({ width: newWidth, height: newHeight });
		}
	};

	// Stop resizing the window and dispatch new dimensions to Redux
	const handleMouseUpResize = () => {
		if (isResizing.current) {
			// End resizing
			isResizing.current = false;

			// Remove mousemove event listener
			window.removeEventListener('mousemove', handleMouseMoveResize);

			// Remove mouseup event listener
			window.removeEventListener('mouseup', handleMouseUpResize);

			// Dispatch updated dimensions to Redux store
			dispatch(setAppTempData({ id, updates: { width: dimensions.width, height: dimensions.height } }));
		}
	};

	return (
		<motion.div
			className={`absolute bg-black/[0.65] backdrop-filter backdrop-blur-[26.5px] ${isFullScreen ? 'smooth' : 'rounded-[10px]'}`}
			style={{ top: position.y, left: position.x, width: dimensions.width, height: dimensions.height, maxWidth: dimensions.width, maxHeight: dimensions.height }}
			transition={{ duration: 0.2, ease: 'easeInOut' }}
			animate={{ scale: 1, opacity: 1 }}
			initial={{ scale: 0, opacity: 0 }}
			exit={{ scale: 0, opacity: 0 }}
			ref={windowRef}
		>
			<div className="flex justify-between items-center p-3" onDoubleClick={onFullScreen} onMouseDown={handleMouseDownDrag}>
				<div></div>
				<div className="text-[13px] font-light">{name}</div>
				<button className="smooth hover:text-red-400" onClick={onClose}>
					<IoClose size={18} />
				</button>
			</div>
			<div className="relative block p-4" style={{ height: `${dimensions.height - 50}px`, maxHeight: `${dimensions.height - 50}px` }}>
				{children}
			</div>
			{!isFullScreen && <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={handleMouseDownResize}></div>}
		</motion.div>
	);
};

export default Window;
