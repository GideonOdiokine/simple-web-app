import {
	ConfirmPaymentRequest,
	ConfirmPaymentResponse,
	ConvertCurrencyRequest,
	ConvertCurrencyResponse,
	CreatePaymentRequest,
	CreatePaymentResponse,
	ExchangeRateRequest,
	ExchangeRateResponse,
	GetAccountTypesRequest,
	GetAccountTypesResponse,
	GetBanksRequest,
	GetBanksResponse,
	GetCurrenciesRequest,
	GetCurrenciesResponse,
	GetTransactionsCountRequest,
	GetTransactionsCountResponse,
	GetTransactionsRequest,
	GetTransactionsResponse,
	GetUserDebitBanksRequest,
	GetUserDebitBanksResponse,
	ValidateAccountRequest,
	ValidateAccountResponse,
	VerifyDirectDebitOTPRequest,
	VerifyDirectDebitOTPResponse,
} from "@/types/transactions/transactions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

const postRequest = (url: string, details: any, token?: string) => ({
	url,
	method: "POST",
	headers: {
		Authorization: `Bearer ${token}`,
	},
	body: details,
});

const getRequest = (url: string, token: string) => ({
	url,
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

export const transactions = createApi({
	reducerPath: "transactions",
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_KADAVRA_PAYMENT_URL,
	}),
	extractRehydrationInfo(action, { reducerPath }) {
		if (action.type === HYDRATE) {
			return action.payload[reducerPath];
		}
	},
	endpoints: (builder) => ({
		getExchangeRate: builder.mutation<
			ExchangeRateResponse,
			ExchangeRateRequest
		>({
			query: (credentials) => postRequest("/api/v1/rates/latest", credentials),
		}),
		convertCurrency: builder.mutation<
			ConvertCurrencyResponse,
			ConvertCurrencyRequest
		>({
			query: (credentials) =>
				postRequest(
					"/api/v1/rates/convert",
					credentials.body,
					credentials.token
				),
		}),
		validateAccount: builder.mutation<
			ValidateAccountResponse,
			ValidateAccountRequest
		>({
			query: (credentials) =>
				postRequest(
					"/api/v1/payment/validate/accountnumber",
					credentials.body,
					credentials.token
				),
		}),
		createPayment: builder.mutation<
			CreatePaymentResponse,
			CreatePaymentRequest
		>({
			query: (credentials) =>
				postRequest(
					"/api/v1/payment/create",
					credentials.body,
					credentials.token
				),
		}),
		confirmPayment: builder.mutation<
			ConfirmPaymentResponse,
			ConfirmPaymentRequest
		>({
			query: (credentials) =>
				postRequest(
					"/api/v1/payment/create/confirm",
					credentials.body,
					credentials.token
				),
		}),
		verifyDirectDebitOTP: builder.mutation<
			VerifyDirectDebitOTPResponse,
			VerifyDirectDebitOTPRequest
		>({
			query: (credentials) =>
				postRequest(
					"/api/v1/payment/verify/directdebit",
					credentials.body,
					credentials.token
				),
		}),
		getCurrencies: builder.mutation<
			GetCurrenciesResponse,
			GetCurrenciesRequest
		>({
			query: (credentials) => getRequest("/api/v1/currency", credentials.token),
		}),
		getAccountTypes: builder.mutation<
			GetAccountTypesResponse,
			GetAccountTypesRequest
		>({
			query: (credentials) =>
				getRequest("/api/v1/currency/account/type", credentials.token),
		}),
		getBanks: builder.mutation<GetBanksResponse, GetBanksRequest>({
			query: (credentials) =>
				getRequest(
					`/api/v1/payment/get/banks?country=${credentials.country || "NG"}`,
					credentials.token
				),
		}),
		getTransactions: builder.mutation<
			GetTransactionsResponse,
			GetTransactionsRequest
		>({
			query: (credentials) =>
				getRequest(
					`/api/v1/transactions/history?startDate=${
						credentials.startDate || "2022-01-01"
					}&endDate=${credentials.endDate || "2023-12-12"}&pageNumber=${
						credentials.pageNumber || 1
					}&search=${credentials.search || ""}&status=${
						credentials.status || "all"
					}&pageSize=${credentials.pageSize || 10}`,
					credentials.token
				),
		}),
		getTransactionsCount: builder.mutation<
			GetTransactionsCountResponse,
			GetTransactionsCountRequest
		>({
			query: (credentials) =>
				getRequest(
					`/api/v1/admin/dashboard/user/transaction?duration=1000`,
					credentials.token
				),
		}),
		getUserDebitBanks: builder.mutation<
			GetUserDebitBanksResponse,
			GetUserDebitBanksRequest
		>({
			query: (credentials) =>
				getRequest(`/api/v1/payment/get/user/debitBanks`, credentials.token),
		}),
	}),
});

export const {
	useGetExchangeRateMutation,
	useGetCurrenciesMutation,
	useConvertCurrencyMutation,
	useGetAccountTypesMutation,
	useGetBanksMutation,
	useValidateAccountMutation,
	useCreatePaymentMutation,
	useConfirmPaymentMutation,
	useGetTransactionsMutation,
	useGetTransactionsCountMutation,
	useVerifyDirectDebitOTPMutation,
	useGetUserDebitBanksMutation,
	util: { getRunningOperationPromises },
} = transactions;

export const {
	getExchangeRate,
	getCurrencies,
	getTransactions,
	getTransactionsCount,
	getUserDebitBanks,
} = transactions.endpoints;
