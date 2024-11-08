import { openApp, closeApp } from '~/redux/desktopSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '~/redux/store';
import { useRouter } from 'next/router';

const Taskbar = () => {
	const applications = useSelector((state: RootState) => state.desktop.applications);
	const isAnAppFullScreen = applications.some((app) => app.tempData.isFullScreen);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [isHovered, setIsHovered] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const onLogOut = () => {
		const { query } = router;
		delete query.desktop;
		router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
	};

	const handleAppClick = (appId: string, isOpened: boolean) => {
		dispatch(isOpened ? closeApp(appId) : openApp(appId));
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
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="bg-black/[0.50] flex items-center px-5 gap-x-5 backdrop-blur-[26px] h-[50px] [box-shadow:0px_4px_51px_rgba(0,_0,_0,_0.25)] rounded-[10px]">
					{applications.map((app) => (
						<button
							className={`size-[26px] bg-contain bg-center bg-no-repeat smooth ${app.opened ? '-mt-2' : 'hover:-mt-2'}`}
							onClick={() => handleAppClick(app.id, app.opened)}
							style={{ backgroundImage: `url(${app.icon})` }}
							title={app.name}
							key={app.id}
						/>
					))}
					<button className="size-[26px] bg-[url('/desktop/applications/logout.png')] bg-contain bg-center bg-no-repeat smooth hover:-mt-2" title="LogOut" onClick={onLogOut} />
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
