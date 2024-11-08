import { configureStore } from '@reduxjs/toolkit';
import desktopReducer from './desktopSlice';

export const store = configureStore({
	reducer: {
		desktop: desktopReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
