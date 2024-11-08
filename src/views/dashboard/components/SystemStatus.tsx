import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/views/components/ui/select';
import { LuCpu, LuMemoryStick, LuNetwork, LuArrowBigDown, LuArrowBigUp, LuHardDrive } from 'react-icons/lu';
import type { DashboardData } from '../types';
import { useState } from 'react';

interface Props {
	data: DashboardData;
}

const SystemStatus = ({ data }: Props) => {
	// State hooks to manage the selected devices
	const [selectedStorageDevice, setSelectedStorageDevice] = useState<string>(data.storage[0].id);
	const [selectedNetworkDevice, setSelectedNetworkDevice] = useState<string>(data.network[0].id);

	// Define card configuration
	const statusCards = [
		{
			title: 'Processor',
			value: `${data.processor.usage.toFixed(2)}%`,
			subtitle: `${data.processor.temperature ? data.processor.temperature : 'N/A'}°C`,
			icon: <LuCpu size={35} className="text-muted-foreground" />,
			valueKey: 'processor'
		},
		{
			title: 'RAM Memory',
			value: `${data.ram_memory.usage.toFixed(2)}%`,
			subtitle: `${data.ram_memory.free} GB`,
			icon: <LuMemoryStick size={35} className="text-muted-foreground" />,
			valueKey: 'ram_memory'
		},
		{
			value: (
				<div className="text-lg flex items-center gap-x-2 font-bold mt-2">
					<div className="flex items-center gap-x-1" title="Download">
						<LuArrowBigDown /> {data.network.find((device) => device.id === selectedNetworkDevice)?.download ?? 0} Mbps
					</div>
					<div className="flex items-center gap-x-1" title="Upload">
						<LuArrowBigUp /> {data.network.find((device) => device.id === selectedNetworkDevice)?.upload ?? 0} Mbps
					</div>
				</div>
			),
			selectComponent: (
				<Select onValueChange={(device) => setSelectedNetworkDevice(device)} value={selectedNetworkDevice}>
					<SelectTrigger className="w-[85px] tracking-tight text-sm font-medium border-none outline-none p-0 m-0 ring-0 -mt-1 h-[20px]">
						<SelectValue placeholder="Select Network" />
					</SelectTrigger>
					<SelectContent>
						{data.network.map((device, index) => (
							<SelectItem value={device.id} key={index}>
								{device.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			),
			icon: <LuNetwork size={35} className="text-muted-foreground" />,
			valueKey: 'network'
		},
		{
			value: (
				<>
					<h2 className="text-2xl flex items-center gap-x-2 font-bold">{data.storage.find((device) => device.id === selectedStorageDevice)?.usage}%</h2>
					<p className="text-xs text-muted-foreground">
						Used: {data.storage.find((device) => device.id === selectedStorageDevice)?.used} GB / Total: {data.storage.find((device) => device.id === selectedStorageDevice)?.total} GB
					</p>
				</>
			),
			selectComponent: (
				<Select onValueChange={(device) => setSelectedStorageDevice(device)} value={selectedStorageDevice}>
					<SelectTrigger className="w-[85px] tracking-tight text-sm font-medium border-none outline-none p-0 m-0 ring-0 -mt-1 h-[20px]">
						<SelectValue placeholder="Select Storage" />
					</SelectTrigger>
					<SelectContent>
						{data.storage.map((device, index) => (
							<SelectItem value={device.id} key={index}>
								Storage {device.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			),
			icon: <LuHardDrive size={35} className="text-muted-foreground" />,
			valueKey: 'storage'
		}
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{statusCards.map((card, index) => (
				<div key={index} className="h-[125px] bg-card text-card-foreground border shadow flex justify-between items-center px-5 rounded-xl">
					<div className="flex flex-col justify-center items-start">
						{card.selectComponent ? card.selectComponent : <h3 className="tracking-tight text-sm font-medium">{card.title}</h3>}

						<div>{card.value}</div>
						{card.subtitle && <p className="text-xs text-muted-foreground">{card.subtitle}</p>}
					</div>

					<div className="flex justify-center items-center">{card.icon}</div>
				</div>
			))}
		</div>
	);
};

export default SystemStatus;
