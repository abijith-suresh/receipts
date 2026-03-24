type PublicClerkEnv = {
	PUBLIC_CLERK_SIGN_IN_URL?: string;
	PUBLIC_CLERK_SIGN_UP_URL?: string;
	PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL?: string;
	PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL?: string;
	PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL?: string;
	PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL?: string;
	PUBLIC_CLERK_AFTER_SIGN_IN_URL?: string;
	PUBLIC_CLERK_AFTER_SIGN_UP_URL?: string;
	PUBLIC_CLERK_AFTER_SIGN_OUT_URL?: string;
	PUBLIC_CLERK_SSO_CALLBACK_URL?: string;
};

export function resolveClerkPaths(env: PublicClerkEnv) {
	const signInUrl = env.PUBLIC_CLERK_SIGN_IN_URL || '/login';
	const signUpUrl = env.PUBLIC_CLERK_SIGN_UP_URL || '/login';
	const signInForceRedirectUrl =
		env.PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL ||
		env.PUBLIC_CLERK_AFTER_SIGN_IN_URL ||
		'/dashboard';
	const signInFallbackRedirectUrl =
		env.PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ||
		env.PUBLIC_CLERK_AFTER_SIGN_IN_URL ||
		signInForceRedirectUrl;
	const signUpForceRedirectUrl =
		env.PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL ||
		env.PUBLIC_CLERK_AFTER_SIGN_UP_URL ||
		'/dashboard';
	const signUpFallbackRedirectUrl =
		env.PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ||
		env.PUBLIC_CLERK_AFTER_SIGN_UP_URL ||
		signUpForceRedirectUrl;
	const signOutRedirectUrl = env.PUBLIC_CLERK_AFTER_SIGN_OUT_URL || '/';
	const ssoCallbackUrl = env.PUBLIC_CLERK_SSO_CALLBACK_URL || '/sso-callback';

	return {
		signInUrl,
		signUpUrl,
		signInForceRedirectUrl,
		signInFallbackRedirectUrl,
		signUpForceRedirectUrl,
		signUpFallbackRedirectUrl,
		signOutRedirectUrl,
		ssoCallbackUrl,
	} as const;
}
