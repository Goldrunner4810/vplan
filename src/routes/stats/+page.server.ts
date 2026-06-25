import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) throw redirect(302, '/auth');

    try {
        // Wir stellen sicher, dass wir explizite Alias-Namen haben
        const statsQuery = await db.execute(`
            SELECT 
                p.id, 
                p.title, 
                p.zeit, 
                COALESCE(COUNT(et.user_id) FILTER (WHERE et.status = 'zugesagt'), 0) AS zusagen,
                COALESCE(COUNT(et.user_id) FILTER (WHERE et.status = 'abgesagt'), 0) AS absagen
            FROM posts p
            LEFT JOIN event_teilnehmer et ON p.id = et.post_id
            WHERE p.zeit IS NOT NULL
            GROUP BY p.id, p.title, p.zeit
            ORDER BY p.zeit ASC
        `);

        return {
            stats: (statsQuery as any).rows ?? statsQuery ?? []
        };
    } catch (err) {
        console.error("Datenbank-Fehler:", err);
        return { stats: [] };
    }
};

export const actions: Actions = {
    exportCSV: async () => {
        const result = await db.execute(`
            SELECT p.title, p.zeit, 
            COALESCE(COUNT(et.user_id) FILTER (WHERE et.status = 'zugesagt'), 0) AS zusagen,
            COALESCE(COUNT(et.user_id) FILTER (WHERE et.status = 'abgesagt'), 0) AS absagen
            FROM posts p
            LEFT JOIN event_teilnehmer et ON p.id = et.post_id
            GROUP BY p.title, p.zeit
        `);

        const data = (result as any).rows ?? result;

        let csvContent = "\uFEFFEvent,Datum,Zusagen,Absagen\n";
        for (const row of data) {
            const date = row.zeit ? new Date(row.zeit).toLocaleDateString('de-AT') : '';
            csvContent += `"${row.title}","${date}",${row.zusagen},${row.absagen}\n`;
        }

        return new Response(csvContent, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="statistik.csv"'
            }
        });
    }
};