import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
	(api: MiddlewareAPI) => (next) => (action) => {
		// RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
		if (isRejectedWithValue(action)) {
			// console.warn("We got a rejected action!");

			if (!navigator.onLine)
				toast?.error("You do not have an active internet connection");
		}

		return next(action);
	};
