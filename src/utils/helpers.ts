import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { useEffect } from 'react';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const swrFetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useEffectAsync = (callback: () => void) => {
	useEffect(() => {
		callback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
