import { makeEndpointRequest } from '~/utils/api';
import { useEffectAsync } from '~/utils/helpers';
import { RootState } from '~/redux/store';
import { useSelector } from 'react-redux';
import { LuFolder } from 'react-icons/lu';
import { useState } from 'react';

const Files = () => {
	const app = useSelector((state: RootState) => state.desktop.applications.find((app) => app.id === 'files')!);

	// State for storing folder data
	const [data, setData] = useState<FixableAny>(null);

	// State for storing current path
	const [path, setPath] = useState<string>('/');

	// Function to request folder data from the server based on the current path
	const requestData = async () => {
		const res = await makeEndpointRequest('/api/desktop/files', 'POST', {
			path
		});

		// Update state with fetched data if successful
		if (res.status === 200) {
			return setData(res.data);
		}
	};

	// Function to initialize
	const onInit = async () => {
		const res = await makeEndpointRequest('/api/desktop/files', 'GET', {});

		// Set the root path when initialized successfully
		if (res.status === 200) {
			return setPath(res.data.rootPath);
		}
	};

	// Handle click event on a folder, update the path, and fetch data for the selected folder
	const handleFolderClick = async (folderPath: string) => {
		// Update the path to the clicked folder
		setPath(folderPath);

		// Fetch the data for the new folder path
		await requestData();
	};

	useEffectAsync(async () => {
		// Initialize the file explorer and set the root path
		await onInit();

		// Fetch the data for the root folder
		await requestData();
	});

	// Split the current path into parts for breadcrumb navigation
	const splitPath = path.split('\\').filter(Boolean);

	return (
		<div className="flex gap-x-3">
			<div className="block w-[300px] overflow-y-auto overflow-x-hidden pr-2" style={{ maxHeight: `${app.tempData?.height - 70}px` }}>
				{data?.folders?.map((folder: FixableAny, index: number) => (
					<button key={index} onClick={() => handleFolderClick(folder.path)} className="w-full h-[45px] text-sm flex items-center gap-x-2 px-3 rounded-lg hover:bg-black/50">
						<LuFolder />
						{folder.name}
					</button>
				))}
			</div>
			<div className="w-full h-full">
				{/* Location Bar */}
				<div className="bg-black/40 flex items-center gap-x-2 p-2.5 rounded-lg">
					{splitPath.map((part, index) => {
						const partialPath = splitPath.slice(0, index + 1).join('\\');
						return (
							<span key={index} className="flex items-center">
								<button className="text-sm" onClick={() => handleFolderClick(partialPath)}>
									{part}
								</button>
								{index < splitPath.length - 1 && <span className="mx-1 text-xs text-muted-foreground">/</span>}
							</span>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Files;
