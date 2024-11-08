import { openApp, closeApp } from '~/redux/desktopSlice';
import { useSelector, useDispatch } from 'react-redux';
import { LuPower, LuRotateCcw } from 'react-icons/lu';
import { makeEndpointRequest } from '~/utils/api';
import { useState, useEffect } from 'react';
import { RootState } from '~/redux/store';

const Taskbar = () => {
	const applications = useSelector((state: RootState) => state.desktop.applications);
	const isAnAppFullScreen = applications.some((app) => app.tempData.isFullScreen);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [isHovered, setIsHovered] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const handleAppClick = (appId: string, isOpened: boolean) => {
		dispatch(isOpened ? closeApp(appId) : openApp(appId));
	};

	const onReboot = async () => {
		const { status } = await makeEndpointRequest('/api/desktop/reboot', 'POST', {});

		if (status === 200) {
			return alert('System reboot initiated successfully.');
		}

		return alert('Failed to initiate system reboot.');
	};

	const onPowerOff = async () => {
		const { status } = await makeEndpointRequest('/api/desktop/poweroff', 'POST', {});

		if (status === 200) {
			return alert('System shutdown initiated successfully.');
		}

		return alert('Failed to initiate system shutdown.');
	};

	const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	const formattedDate = currentTime.toLocaleDateString();

	return (
		<>
			{isAnAppFullScreen && (
				<div
					className={`fixed left-0 bottom-3 w-full h-[60px] z-10 transition-transform smooth ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}
					onMouseLeave={() => setIsHovered(false)}
					onMouseEnter={() => setIsHovered(true)}
				/>
			)}
			<nav
				className={`fixed left-0 w-full flex justify-center items-center gap-x-3 z-20 smooth ${isAnAppFullScreen ? (isHovered ? 'bottom-3' : '-bottom-14') : 'bottom-3'}`}
				onMouseLeave={() => setIsHovered(false)}
				onMouseEnter={() => setIsHovered(true)}
			>
				<div className="bg-black/[0.50] flex items-center px-5 gap-x-5 backdrop-blur-[26px] h-[50px] [box-shadow:0px_4px_51px_rgba(0,_0,_0,_0.25)] rounded-[10px]">
					{applications.map((app) => (
						<button
							className={`size-[35px] flex justify-center items-center rounded-lg smooth ${app.opened ? '-mt-2' : 'hover:-mt-2'}`}
							onClick={() => handleAppClick(app.id, app.opened)}
							style={{ backgroundColor: app.icon.color }}
							title={app.name}
							key={app.id}
						>
							<app.icon.content size={23} />
						</button>
					))}

					{/* Native */}
					<button className="size-[35px] flex justify-center items-center rounded-lg smooth hover:-mt-2" style={{ backgroundColor: '#CDB534' }} title="Reboot" onClick={onReboot}>
						<LuRotateCcw size={23} />
					</button>

					<button className="size-[35px] flex justify-center items-center rounded-lg smooth hover:-mt-2" style={{ backgroundColor: '#FF3A3A' }} title="PowerOff" onClick={onPowerOff}>
						<LuPower size={23} />
					</button>
				</div>
				<div className="bg-black/[0.50] flex items-center px-5 gap-x-3 backdrop-blur-[26px] h-[50px] [box-shadow:0px_4px_51px_rgba(0,_0,_0,_0.25)] rounded-[10px]">
					<div className="font-medium text-base">{formattedTime}</div>
					<div className="font-light text-base">{formattedDate}</div>
				</div>
			</nav>
		</>
	);
};

export default Taskbar;
