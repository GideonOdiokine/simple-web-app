import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
	sessionTimedOut: boolean;
};

const initialState = {
	sessionTimedOut: false,
} as AuthState;

const slice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setSessionTimedOut: (state, action: PayloadAction<boolean>) => {
			state.sessionTimedOut = action.payload;
		},
	},
});

export const { setSessionTimedOut } = slice.actions;

export default slice.reducer;
