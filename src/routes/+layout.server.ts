import { buildClerkProps } from 'svelte-clerk/server';

export const load = async ({ locals }: { locals: App.Locals }) => {
	return {
		...buildClerkProps(locals.auth()),
	};
};
