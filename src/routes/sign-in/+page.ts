import { redirect } from '@sveltejs/kit';

export const load = ({ url }: { url: URL }) => {
	throw redirect(307, `/login${url.search}`);
};
