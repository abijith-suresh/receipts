import { Clerk } from '@clerk/clerk-js';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { env } from '$env/dynamic/public';

let clerkPromise: Promise<Clerk> | null = null;

function redirectWithGoto(to: string) {
	return goto(to);
}

export function getClerk() {
	if (!browser) {
		throw new Error('Clerk can only be used in the browser.');
	}

	const publishableKey = env.PUBLIC_CLERK_PUBLISHABLE_KEY;

	if (!publishableKey) {
		throw new Error('Missing PUBLIC_CLERK_PUBLISHABLE_KEY.');
	}

	if (!clerkPromise) {
		clerkPromise = (async () => {
			const clerk = new Clerk(publishableKey);

			await clerk.load({
				signInUrl: env.PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
				signUpUrl: env.PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
				signInForceRedirectUrl:
					env.PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard',
				signInFallbackRedirectUrl:
					env.PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard',
				signUpForceRedirectUrl:
					env.PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/dashboard',
				signUpFallbackRedirectUrl:
					env.PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/dashboard',
				routerPush: redirectWithGoto,
				routerReplace: (to) => goto(to, { replaceState: true }),
			});

			window.Clerk = clerk;

			return clerk;
		})();
	}

	return clerkPromise;
}
