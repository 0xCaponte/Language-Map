/**
 * @fileoverview API in charge of managing the GeoJSON Data found in the server-side resources
 */

import type { RequestHandler } from '@sveltejs/kit';

/**
 * Returns a TopoJson file from the server's resources
 *
 * @param request
 * @returns
 */
export const GET: RequestHandler = async ({ request }) => {
   

    try {

        const response = await fetch('https://r2.languagemap.world/resources/countries-110m.json');
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data): ${response.statusText}');
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });


    } catch (error) {

        console.log(error);
        return new Response(JSON.stringify({ error: 'Error reading the TopoJSON file.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
