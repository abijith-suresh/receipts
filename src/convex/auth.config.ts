import type { AuthConfig } from 'convex/server';

const issuerDomain = process.env.CLERK_FRONTEND_API_URL;

if (!issuerDomain) {
	throw new Error(
		'CLERK_FRONTEND_API_URL must be set in the Convex environment.',
	);
}

export default {
	providers: [
		{
			domain: issuerDomain,
			applicationID: 'convex',
		},
	],
} satisfies AuthConfig;
