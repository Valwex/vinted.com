export enum VerificationType {
  BankAccount = 'bank_account',
  Checkout = 'checkout',
  Login = 'login',
  Phone = 'phone',
  EntityHash = 'EntityHash',
}

export enum VerificationChannel {
  Phone = 'phone',
  Email = 'email',
  Sms = 'sms',
}

export enum TwoFactorAuthentificationType {
  BankAccount = 'BankAccount',
  Transaction = 'Transaction',
  UserLoginTwoFactorAuth = 'UserLoginTwoFactorAuth',
  PhoneNumber = 'PhoneNumber',
  PhoneNumberChange = 'PhoneNumberChange',
}

export enum VerificationPromptCategory {
  GoodActor = 'good_actor',
  BadActor = 'bad_actor',
}

export enum VerificationMethods {
  Email = 'email',
  Phone = 'phone',
  EmailCode = 'email_code',
  Google = 'google',
}

export enum VerificationActions {
  BalanceWithdrawal = 'balance_withdrawal',
  AccountDeletion = 'account_deletion',
  DataExport = 'data_export',
}

export enum VerificationTrigger {
  ApRegistration = 'ap_registration',
}
