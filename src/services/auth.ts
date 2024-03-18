import {
	GenerateEmailOTPRequest,
	GenerateEmailOTPResponse,
	GenerateForgotPasswordRequest,
	GenerateForgotPasswordResponse,
	GeneratePhoneOTPRequest,
	GeneratePhoneOTPResponse,
	LoginRequest,
	RegisterUserRequest,
	RegisterUserResponse,
	ResetPasswordRequest,
	ResetPasswordResponse,
	UserResponse,
	VerifyBVNRequest,
	VerifyBVNResponse,
	VerifyEmailOTPRequest,
	VerifyEmailOTPResponse,
	VerifyPhoneOTPRequest,
	VerifyPhoneOTPResponse,
} from "@/types/auth/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const postRequest = (url: string, details: any) => ({
	url,
	method: "POST",
	body: details,
});

export const auth = createApi({
	reducerPath: "auth",
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
		// prepareHeaders: (headers, { getState }) => {
		// 	// By default, if we have a token in the store, let's use that for authenticated requests
		// 	const token = (getState() as RootState).auth.token;
		// 	if (token) {
		// 		headers.set("authorization", `Bearer ${token}`);
		// 	}
		// 	return headers;
		// },
	}),
	endpoints: (builder) => ({
		login: builder.mutation<UserResponse, LoginRequest>({
			query: (credentials) => postRequest("/api/v1/login", credentials),
		}),
		verifyBVN: builder.mutation<VerifyBVNResponse, VerifyBVNRequest>({
			query: (credentials) => postRequest("/api/v1/Register/bvn", credentials),
		}),
		generatePhoneOTP: builder.mutation<
			GeneratePhoneOTPResponse,
			GeneratePhoneOTPRequest
		>({
			query: (credentials) =>
				postRequest("/api/v1/Register/phone/generate/otp", credentials),
		}),
		verifyPhoneOTP: builder.mutation<
			VerifyPhoneOTPResponse,
			VerifyPhoneOTPRequest
		>({
			query: (credentials) =>
				postRequest("/api/v1/Register/phone/validate/otp", credentials),
		}),
		generateEmailOTP: builder.mutation<
			GenerateEmailOTPResponse,
			GenerateEmailOTPRequest
		>({
			query: (credentials) =>
				postRequest("/api/v1/Register/email/generate/otp", credentials),
		}),
		verifyEmailOTP: builder.mutation<
			VerifyEmailOTPResponse,
			VerifyEmailOTPRequest
		>({
			query: (credentials) =>
				postRequest("/api/v1/Register/email/validate/otp", credentials),
		}),
		registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
			query: (credentials) => postRequest("/api/v1/Register/user", credentials),
		}),
		generateForgetPasswordOTP: builder.mutation<
			GenerateForgotPasswordResponse,
			GenerateForgotPasswordRequest
		>({
			query: (credentials) =>
				postRequest("/api/v1/password/forgot", credentials),
		}),
		resetPassword: builder.mutation<
			ResetPasswordResponse,
			ResetPasswordRequest
		>({
			query: (credentials) =>
				postRequest("/api/v1/password/reset", credentials),
		}),
	}),
});

export const {
	useLoginMutation,
	useVerifyBVNMutation,
	useGeneratePhoneOTPMutation,
	useVerifyPhoneOTPMutation,
	useGenerateEmailOTPMutation,
	useVerifyEmailOTPMutation,
	useRegisterUserMutation,
	useGenerateForgetPasswordOTPMutation,
	useResetPasswordMutation,
} = auth;
