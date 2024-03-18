import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { auth } from "src/services/auth";
import { transactions } from "src/services/transactions";
import { user } from "src/services/user";
import { rtkQueryErrorLogger } from "./middlewares";
import authReducer from "../features/auth/authSlice";

export function makeStore() {
	return configureStore({
		reducer: {
			authReducer,
			[auth.reducerPath]: auth.reducer,
			[transactions.reducerPath]: transactions.reducer,
			[user.reducerPath]: user.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(
				auth.middleware,
				transactions.middleware,
				user.middleware,
				rtkQueryErrorLogger
			),
	});
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

export type AppStore = ReturnType<typeof makeStore>;

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
