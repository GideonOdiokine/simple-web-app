import {
	ChangePasswordRequest,
	ChangePasswordResponse,
	DeactivateAccountRequest,
	DeactivateAccountResponse,
	UpgradeAccountRequest,
	UpgradeAccountResponse,
	UserRequest,
	UserResponse,
} from "@/types/user/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

const getRequest = (url: string, token: string) => ({
	url,
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

const postRequest = (url: string, details: any, token: string) => ({
	url,
	method: "POST",
	headers: {
		Authorization: `Bearer ${token}`,
	},
	body: details,
});

export const user = createApi({
	reducerPath: "user",
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
		// prepareHeaders: (headers, { getState }) => {
		// 	// By default, if we have a token in the store, let's use that for authenticated requests

		// 	// console.log("token form getToken", token);

		// 	// if (token) {
		// 	// 	headers.set("authorization", `Bearer ${token}`);
		// 	// }
		// 	return headers;
		// },
	}),
	extractRehydrationInfo(action, { reducerPath }) {
		if (action.type === HYDRATE) {
			return action.payload[reducerPath];
		}
	},
	endpoints: (builder) => ({
		getUser: builder.mutation<UserResponse, any>({
			query: (token) => getRequest("/api/v1/user/me", token),
		}),
		changePassword: builder.mutation<
			ChangePasswordResponse,
			ChangePasswordRequest
		>({
			query: (credentials) =>
				postRequest("/api/v1/password/change", credentials, credentials.token),
		}),
		upgradeAccount: builder.mutation<
			UpgradeAccountResponse,
			UpgradeAccountRequest
		>({
			query: (credentials) =>
				postRequest(
					"/api/v1/tier/upgrade",
					credentials.body,
					credentials.token
				),
		}),
		deactivateAccount: builder.mutation<
			DeactivateAccountResponse,
			DeactivateAccountRequest
		>({
			query: (credentials) =>
				postRequest("/api/v1/user/deactivate", "", credentials.token),
		}),
	}),
});

export const {
	useGetUserMutation,
	useChangePasswordMutation,
	useUpgradeAccountMutation,
	useDeactivateAccountMutation,
	util: { getRunningOperationPromises },
} = user;

export const { getUser } = user.endpoints;
