import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) throw redirect(302, '/auth');

    try {
        // Holt alle Events mit Datum
        const eventsQuery = await db.execute(`
            SELECT id, title, zeit 
            FROM posts 
            WHERE zeit IS NOT NULL
            ORDER BY zeit ASC
        `);

        return {
            // HIER REINGEPACKT: User-Infos für die Navigationsleiste bereitstellen
            user: event.locals.user,
            isAdmin: event.locals.user.role === 'admin', // Falls deine Admin-Rolle so heißt
            events: (eventsQuery as any).rows ?? eventsQuery ?? []
        };
    } catch (err) {
        console.error("Kalender-Datenbank-Fehler:", err);
        return { 
            user: event.locals.user,
            isAdmin: event.locals.user.role === 'admin',
            events: [] 
        };
    }
};