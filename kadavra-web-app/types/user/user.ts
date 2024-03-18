export interface UserResponse {
	responseCode: string;
	user: {
		id: number;
		firstName: string;
		lastName: string;
		middleName: string;
		phoneNumber: string;
		email: string;
		bvn: string;
		dateOfBirth: string;
		gender: string;
		status: boolean;
		passwordSalt: string;
		passwordHash: string;
		refreshToken: string;
		isPhoneValidated: boolean;
		isEmailValidated: boolean;
		notificationId: string;
		isPushNotifications: boolean;
		address: string;
		tier: number;
		createdAt: string;
		updatedAt: string;
	};
}

export interface UserRequest {
	token: string;
}

export interface ChangePasswordResponse {
	responseCode: string;
	responseDescription: string;
}

export interface ChangePasswordRequest {
	token: string;
	password: string;
	newPassword: string;
	confirmNewPassword: string;
}

export interface UpgradeAccountResponse {
	responseCode: string;
	responseDescription: string;
}

export interface UpgradeAccountRequest {
	token: string;
	utility: any;
	governmentId: any;
	body: any;
}

export interface DeactivateAccountResponse {
	responseCode: string;
	responseDescription: string;
}

export interface DeactivateAccountRequest {
	token: string;
}
