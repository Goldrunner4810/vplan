import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

async function isAdmin(userId: string) {
    const result = await db.execute(sql`
        SELECT roles.name
        FROM "user"
        JOIN roles ON roles.id = "user".role_id
        WHERE "user".id = ${userId}
        LIMIT 1
    `);

    return result[0]?.name === 'Admin';
}

export const load: PageServerLoad = async (event) => {
    // Überprüfen, ob ein Nutzer eingeloggt ist und Admin-Rechte hat
    const userIsAdmin = event.locals.user ? await isAdmin(event.locals.user.id) : false;

    // Wenn der Nutzer KEIN Admin ist, geben wir Dummy-Daten zurück.
    // Das sorgt für den visuellen Blur-Effekt auf dem Bildschirm, verhindert aber Datenlecks!
    if (!userIsAdmin) {
        return {
            isAdmin: false,
            stats: [
                { id: 1, title: 'Sommerfest 2024', zeit: new Date().toISOString(), zusagen: 45, absagen: 12 },
                { id: 2, title: 'Weihnachtsfeier', zeit: new Date().toISOString(), zusagen: 80, absagen: 5 },
                { id: 3, title: 'Jahreshauptversammlung', zeit: new Date().toISOString(), zusagen: 30, absagen: 20 },
            ]
        };
    }

    // Wenn der Nutzer Admin ist, laden wir die echten Daten aus der Datenbank
    try {
        const statsQuery = await db.execute(`
            SELECT 
                p.id, 
                p.title, 
                p.zeit, 
                COALESCE(COUNT(et.user_id) FILTER (WHERE et.status = 'kommen'), 0) AS zusagen,
                COALESCE(COUNT(et.user_id) FILTER (WHERE et.status = 'absagen'), 0) AS absagen
            FROM posts p
            LEFT JOIN event_teilnehmer et ON p.id = et.post_id
            WHERE p.zeit IS NOT NULL
            GROUP BY p.id, p.title, p.zeit
            ORDER BY p.zeit ASC
        `);

        return {
            isAdmin: true,
            stats: (statsQuery as any).rows ?? statsQuery ?? []
        };
    } catch (err) {
        console.error("Datenbank-Fehler:", err);
        return { isAdmin: true, stats: [] };
    }
};
