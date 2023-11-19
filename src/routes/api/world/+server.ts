/**
 * @fileoverview API in charge of managing the GeoJSON Data found in the server-side resources
 */

import fs from 'fs';
import path from 'path';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Returns a TopoJson file from the server's resources
 *
 * @param request
 * @returns
 */
export const GET: RequestHandler = async ({ request }) => {
    try {
        const filePath = path.resolve('src', 'lib', 'server', 'resources', 'countries-110m.json');
		const data = fs.readFileSync(filePath, 'utf-8');

        return new Response(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error reading the TopoJSON file.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
