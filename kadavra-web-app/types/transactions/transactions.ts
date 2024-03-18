export interface ExchangeRateResponse {
	responseCode: string;
	baseCurrency: string;
	date: string;
	rates: {};
}

export interface ExchangeRateRequest {
	baseCurrency: string;
	targetCurrency: string;
}

export interface ConvertCurrencyResponse {
	responseCode: string;
	baseCurrency: string;
	date: string;
	rates: {};
}

export interface ConvertCurrencyRequest {
	token: string;
	body: {
		fromCurrency: string;
		toCurrency: string;
		amount: number;
	};
}

export interface ValidateAccountResponse {
	responseCode: string;
}

export interface ValidateAccountRequest {
	token: string;
	body: {
		bankCode: string;
		accountNumber: string;
	};
}

export interface ConfirmPaymentResponse {
	responseCode: string;
}

export interface ConfirmPaymentRequest {
	token: string;
	body: {
		reference: string;
		paymentChannel: "card" | "bank_account";
		accountNumber?: string;
		accountName?: string;
		bankCode?: string;
		bankName?: string;
	};
}

export interface VerifyDirectDebitOTPResponse {
	responseCode: string;
}

export interface VerifyDirectDebitOTPRequest {
	token: string;
	body: {
		otp: string;
		flwRef: string;
	};
}

export interface CreatePaymentResponse {
	responseCode: string;
}

export interface CreatePaymentRequest {
	token: string;
	body: {
		baseCurrency: string;
		targetCurrency: string;
		amount: number;
		transactionFee?: number;
		recipient: {
			bankName?: string;
			bankCode?: string;
			accountNumber?: string;
			accountName?: string;
			email?: string;
			phone?: string;
			address?: string;
			swiftCode?: string;
			achRoutingNumber?: string;
			iban?: string;
			accountType: string;
			wireRoutingNumber?: string;
			sender?: string;
			firstName?: string;
			lastName?: string;
			beneficiaryName?: string;
			beneficiaryOccupation?: string;
			senderIDNumber?: string;
			senderIdType?: string;
			senderMobileNumber?: string;
			senderAddress?: string;
			senderIdExpiry?: string;
			senderOccupation?: string;
			relationshipToBeneficiary?: string;
			transferPurpose?: string;
			senderCity?: string;
		};
	};
}

export interface GetCurrenciesResponse {
	responseCode: string;
}

export interface GetCurrenciesRequest {
	token: string;
}

export interface GetAccountTypesResponse {
	responseCode: string;
}

export interface GetAccountTypesRequest {
	token: string;
}

export interface GetBanksResponse {
	responseCode: string;
}

export interface GetBanksRequest {
	token: string;
	country:
		| "NG"
		| "US"
		| "GH"
		| "KE"
		| "UG"
		| "ZA"
		| "TZ"
		| "RW"
		| "CM"
		| "SL"
		| "AO"
		| "CI"
		| "ML"
		| "SN"
		| "TG"
		| "KE"
		| "UG"
		| "ZA"
		| "TZ"
		| "RW"
		| "CM"
		| "SL"
		| "AO"
		| "CI"
		| "ML"
		| "SN"
		| "TG";
}

export interface GetTransactionsResponse {
	responseCode: string;
}

export interface GetTransactionsRequest {
	token: string;
	startDate?: string;
	endDate?: string;
	search?: string;
	status?: "PENDING" | "SUCCESS" | "FAILED" | "all";
	pageNumber?: number;
	pageSize?: number;
}

export interface GetTransactionsCountResponse {
	responseCode: string;
}

export interface GetTransactionsCountRequest {
	token: string;
}

export interface GetUserDebitBanksResponse {
	responseCode: string;
}

export interface GetUserDebitBanksRequest {
	token: string;
}
