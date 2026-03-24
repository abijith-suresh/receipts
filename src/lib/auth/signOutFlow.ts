import { writable } from 'svelte/store';

export const signOutRedirectPending = writable(false);

export function markSignOutRedirectPending() {
	signOutRedirectPending.set(true);
}

export function clearSignOutRedirectPending() {
	signOutRedirectPending.set(false);
}
