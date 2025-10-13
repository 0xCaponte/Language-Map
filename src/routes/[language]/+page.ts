import type { Load } from '@sveltejs/kit';

export const load: Load = ({ params }) => {
  return {
    languageName: params.language
  };
};