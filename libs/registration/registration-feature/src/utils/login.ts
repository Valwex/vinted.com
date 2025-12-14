export const loginRegex = /^[a-z0-9][a-z0-9_.-]*[a-z0-9]$/i

export const isLoginValid = (email: string): boolean => loginRegex.test(email)
