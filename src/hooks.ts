import type { Handle } from '@sveltejs/kit';
// import * as cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event, { ssr: false });

  return response;
};
