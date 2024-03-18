export interface UserResponse {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	token: string;
	refreshToken: string;
}

export interface LoginRequest {
	userName: string;
	password: string;
}

export interface VerifyBVNResponse {
	responseCode: string;
	data: {
		registrationId: string;
		bvn: string;
		otp: string;
		bvnData: {
			dob: string;
			lastName: string;
			firstName: string;
			middleName: string;
			phoneNumber: string;
			email: string;
			bvnPhoneNumber: string;
		};
	};
}

export interface VerifyBVNRequest {
	bvn: string;
	bvnPhone: string;
	dateOfBirth: string;
}

export interface GeneratePhoneOTPResponse {
	responseCode: string;
	data: {
		registrationId: string;
		phoneNumber: string;
		bvn: string;
	};
	otp: string;
}

export interface GeneratePhoneOTPRequest {
	registrationId: string;
	bvn: string;
	phoneNumber: string;
}
export interface VerifyPhoneOTPResponse {
	responseCode: string;
	data: {
		registrationId: string;
		phoneNumber: string;
		bvn: string;
	};
	otp: string;
}

export interface VerifyPhoneOTPRequest {
	registrationId: string;
	bvn: string;
	phoneNumber: string;
	otp: string;
}

export interface GenerateEmailOTPResponse {
	responseCode: string;
	data: {
		registrationId: string;
		email: string;
		bvn: string;
	};
	otp: string;
}

export interface GenerateEmailOTPRequest {
	registrationId: string;
	bvn: string;
	email: string;
}
export interface VerifyEmailOTPResponse {
	responseCode: string;
	data: {
		registrationId: string;
		email: string;
		bvn: string;
	};
	otp: string;
}

export interface VerifyEmailOTPRequest {
	registrationId: string;
	bvn: string;
	email: string;
	otp: string;
}
export interface RegisterUserResponse {
	email: string;
	firstName: string;
	id: number;
	lastName: string;
	phoneNumber: string;
	refreshToken: string;
	token: string;
}

export interface RegisterUserRequest {
	registrationId: string;
	bvn: string;
	password: string;
	confirmPassword: string;
	address: string;
	gender: string;
}

export interface GenerateForgotPasswordResponse {
	otp: string;
	responseCode: string;
	responseDescription: string;
}

export interface GenerateForgotPasswordRequest {
	userName: string;
}

export interface ResetPasswordResponse {
	responseCode: string;
	responseDescription: string;
}

export interface ResetPasswordRequest {
	userName: string;
	otp: string;
	newPassword: string;
	confirmPassword: string;
}
