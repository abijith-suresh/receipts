import type { UserIdentity } from 'convex/server';

type AuthContext = {
	auth: {
		getUserIdentity(): Promise<UserIdentity | null>;
	};
};

export async function requireAuth(ctx: AuthContext) {
	const identity = await ctx.auth.getUserIdentity();

	if (!identity) {
		throw new Error('Unauthorized');
	}

	return identity;
}

export async function getCurrentUserInfo(ctx: AuthContext) {
	const identity = await requireAuth(ctx);

	return {
		clerkId: identity.subject,
		email: identity.email ?? undefined,
		name: identity.name ?? undefined,
		imageUrl: identity.pictureUrl ?? undefined,
	};
}
