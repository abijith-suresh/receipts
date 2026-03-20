import type { ConvexClient } from 'convex/browser';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

import { getClerk } from './clerk';

export type AuthSnapshot = {
	ready: boolean;
	signedIn: boolean;
	userId: string | null;
	name: string | null;
	email: string | null;
};

const initialAuthState: AuthSnapshot = {
	ready: false,
	signedIn: false,
	userId: null,
	name: null,
	email: null,
};

export const auth = writable<AuthSnapshot>(initialAuthState);

let startPromise: Promise<void> | null = null;

async function syncAuthState() {
	const clerk = await getClerk();

	auth.set({
		ready: true,
		signedIn: clerk.isSignedIn,
		userId: clerk.user?.id ?? null,
		name: clerk.user?.fullName ?? clerk.user?.firstName ?? null,
		email: clerk.user?.primaryEmailAddress?.emailAddress ?? null,
	});
}

export function startClerkAuth(convex: ConvexClient) {
	if (!browser) {
		return Promise.resolve();
	}

	if (!startPromise) {
		startPromise = (async () => {
			const clerk = await getClerk();

			convex.setAuth(async ({ forceRefreshToken }) => {
				if (!clerk.session) {
					return null;
				}

				return await clerk.session.getToken({
					skipCache: forceRefreshToken,
				});
			});

			await syncAuthState();

			clerk.addListener(() => {
				void syncAuthState();
			});
		})();
	}

	return startPromise;
}
