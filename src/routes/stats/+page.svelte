<script lang='ts'>
    import type { PageServerData } from './$types';

    // Wir definieren das Interface explizit, damit TypeScript nicht meckert
    let { data }: { data: PageServerData } = $props();

    // Sicherer Zugriff mit Fallback
    let stats = $state(data.stats || []);

    // Berechnungen mit explizitem Number-Cast
    let totalZusagen = $derived(stats.reduce((acc, curr) => acc + Number(curr.zusagen || 0), 0));
    let totalAbsagen = $derived(stats.reduce((acc, curr) => acc + Number(curr.absagen || 0), 0));

    function formatTime(zeitString: string | Date | null) {
        if (!zeitString) return '-';
        return new Date(zeitString).toLocaleDateString('de-AT', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }
</script>

<main>
    <h1>Vereins-Statistik</h1>

    <section class="controls">
        <form method="POST" action="?/exportCSV">
            <button type="submit" class="export-btn">CSV Export herunterladen</button>
        </form>
    </section>

    <section class="summary">
        <div class="card">
            <h3>Gesamt-Zusagen</h3>
            <p class="big-number">{totalZusagen}</p>
        </div>
        <div class="card">
            <h3>Gesamt-Absagen</h3>
            <p class="big-number">{totalAbsagen}</p>
        </div>
    </section>

    <table>
        <thead>
            <tr>
                <th>Event</th>
                <th>Datum</th>
                <th>Zusagen</th>
                <th>Absagen</th>
            </tr>
        </thead>
        <tbody>
            {#each stats as event}
                <tr>
                    <td><strong>{event.title}</strong></td>
                    <td>{formatTime(event.zeit)}</td>
                    <td><span class="badge green">{event.zusagen}</span></td>
                    <td><span class="badge red">{event.absagen}</span></td>
                </tr>
            {:else}
                <tr><td colspan="4">Keine Daten gefunden.</td></tr>
            {/each}
        </tbody>
    </table>
</main>

<style>
    main { padding: 2rem; }
    .controls { margin-bottom: 20px; }
    .export-btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
    .summary { display: flex; gap: 20px; margin-bottom: 2rem; }
    .card { padding: 1rem; border: 1px solid #ddd; border-radius: 8px; flex: 1; text-align: center; }
    .big-number { font-size: 2rem; font-weight: bold; margin: 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
    .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
    .green { background: #d4edda; color: #155724; }
    .red { background: #f8d7da; color: #721c24; }
</style>