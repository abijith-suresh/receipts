import { redirect } from '@sveltejs/kit';

export const load = ({
	params,
	url,
}: {
	params: { rest: string };
	url: URL;
}) => {
	throw redirect(307, `/login/${params.rest}${url.search}`);
};
