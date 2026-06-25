// src/routes/api/export/+server.ts
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.user) throw error(401, 'Nicht autorisiert');

    try {
        const result = await db.execute(`
            SELECT p.title, p.zeit, 
            COALESCE(COUNT(et.user_id) FILTER (WHERE et.status = 'kommen'), 0) AS zusagen,
            COALESCE(COUNT(et.user_id) FILTER (WHERE et.status = 'absagen'), 0) AS absagen
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
    } catch (err) {
        console.error("CSV-Export Fehler:", err);
        throw error(500, 'Fehler beim Erstellen der CSV');
    }
};