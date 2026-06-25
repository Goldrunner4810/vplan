<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	type EventStat = {
		id: number;
		title: string;
		zeit: string | Date | null;
		zusagen: number | string | null;
		absagen: number | string | null;
	};

	let { data }: { data: PageServerData } = $props();

	let stats = $derived((data.stats || []) as EventStat[]);

	let totalZusagen = $derived(stats.reduce((acc: number, curr: EventStat) => acc + Number(curr.zusagen || 0), 0));
	let totalAbsagen = $derived(stats.reduce((acc: number, curr: EventStat) => acc + Number(curr.absagen || 0), 0));

	function formatTime(zeitString: string | Date | null) {
		if (!zeitString) return '-';
		return new Date(zeitString).toLocaleDateString('de-AT', {
			day: '2-digit', month: '2-digit', year: 'numeric'
		});
	}
</script>

<nav class="top-nav">
	<h1>Vereinsmanager</h1>
	<div class="nav-links">
		<span class="user-badge" style="color: #E5E7EB; margin-right: 1rem;">
			Hi, {data.user?.name || 'Benutzer'}!
		</span>
		
		<a href="/dash" class="nav-link">Dashboard</a>
		
		{#if data.isAdmin}
			<a href="/post/new" class="nav-link">Add</a>
			<a href="/stats" class="nav-link active" style="background: rgba(255, 255, 255, 0.1); color: #FFFFFF;">Statistik</a>
		{/if}
		<a href="/cal" class="nav-link">Callendar</a>
		
		<form method="post" action="?/signOut" use:enhance style="margin: 0; display: inline;">
			<button class="nav-link" style="background: transparent; border: none; cursor: pointer; font-size: inherit;">Sign out</button>
		</form>
	</div>
</nav>

<main class="main-content">
	<div class="dashboard-heading" style="margin-bottom: var(--spacing-xl);">
		<h2>Statistik</h2>
		<div class="sort-form">
			<a href="/api/export" class="btn" download="statistik.csv">CSV Export herunterladen</a>
		</div>
	</div>

	<!-- Zwei-Spalten Grid für die Gesamtübersicht -->
	<div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: var(--spacing-xl); gap: var(--spacing-xl);">
		<div class="card stat-card" style="margin-bottom: 0;">
			<h3 class="stat-label">Gesamt-Zusagen</h3>
			<p class="stat-value green">{totalZusagen}</p>
		</div>
		<div class="card stat-card" style="margin-bottom: 0;">
			<h3 class="stat-label">Gesamt-Absagen</h3>
			<p class="stat-value red">{totalAbsagen}</p>
		</div>
	</div>

	<!-- Tabelle als Card verpackt -->
	<div class="card" style="padding: 0; overflow: hidden;">
		<div class="table-wrapper">
			<table class="stats-table">
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
							<td><span class="badge badge-green">{event.zusagen}</span></td>
							<td><span class="badge badge-red">{event.absagen}</span></td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="text-center" style="padding: 24px; color: var(--text-secondary);">
								Keine Daten gefunden.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

	:global(:root) {
		--bg-main: #F3F4F6; 
		--text-primary: #1F2937;
		--text-secondary: #4B5563;
		
		--primary-color: #1E3A8A; 
		--primary-hover: #1E40AF;
		
		--accent-color: #059669; 
		--accent-hover: #047857;

		--card-bg: #FFFFFF;
		--border-color: #D1D5DB;
		
		--font-base: 16px; 
		--font-heading: 'Inter', sans-serif;
		--font-body: 'Inter', sans-serif;
		
		--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		--shadow-lg: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		--border-radius: 4px; 
		--spacing-sm: 0.5rem;
		--spacing-md: 1rem;
		--spacing-lg: 1.5rem;
		--spacing-xl: 2rem;
		--transition: all 0.2s ease;
	}

	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: var(--font-body);
		font-size: var(--font-base);
		color: var(--text-primary);
		background-color: var(--bg-main);
		line-height: 1.5;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	h1, h2, h3, h4 {
		font-family: var(--font-heading);
		font-weight: 600;
		line-height: 1.2;
		margin-bottom: var(--spacing-md);
		color: var(--text-primary);
	}

	a {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
	}

	a:hover {
		text-decoration: underline;
	}

	/* TOP NAVIGATION BAR */
	.top-nav {
		background: var(--primary-color);
		padding: var(--spacing-md) var(--spacing-xl);
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: var(--shadow-sm);
		position: sticky;
		top: 0;
		z-index: 100;
		border-bottom: 2px solid #172554;
	}

	.top-nav h1 {
		margin: 0;
		color: #FFFFFF;
		font-size: 1.5rem;
	}

	.nav-links {
		display: flex;
		gap: var(--spacing-md);
		align-items: center;
	}

	.nav-link {
		color: #E5E7EB;
		font-family: var(--font-heading);
		font-weight: 500;
		padding: 6px 12px;
		border-radius: var(--border-radius);
		transition: var(--transition);
	}

	.nav-link:hover, .nav-link.active {
		background: rgba(255, 255, 255, 0.1);
		color: #FFFFFF;
		text-decoration: none;
	}

	.user-badge {
		color: #E5E7EB;
		font-size: 0.9em;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* MAIN CONTENT & CARDS */
	.main-content {
		flex: 1;
		max-width: 1000px;
		margin: 0 auto;
		width: 100%;
		padding: var(--spacing-xl);
	}

	.dashboard-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-md);
	}

	.dashboard-heading h2 {
		margin-bottom: 0;
	}

	.card {
		background: var(--card-bg);
		border-radius: var(--border-radius);
		padding: var(--spacing-xl);
		margin-bottom: var(--spacing-xl);
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-sm);
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: var(--spacing-xl);
		align-items: start;
	}

	@media (max-width: 1024px) {
		.dashboard-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.dashboard-heading {
			align-items: stretch;
			flex-direction: column;
		}
	}

	/* BUTTONS */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		font-size: 0.9rem;
		font-weight: 500;
		font-family: var(--font-body);
		cursor: pointer;
		border: 1px solid transparent;
		border-radius: var(--border-radius);
		background: var(--primary-color);
		color: #FFFFFF;
		transition: var(--transition);
	}

	.btn:hover {
		background: var(--primary-hover);
		text-decoration: none;
	}

	/* STATISTIK SPEZIFISCHES CSS */
	.stat-card {
		text-align: center;
		padding: var(--spacing-xl);
	}

	.stat-label {
		color: var(--text-secondary);
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: var(--spacing-sm);
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0;
		line-height: 1;
	}

	.stat-value.green {
		color: var(--accent-color);
	}

	.stat-value.red {
		color: #DC2626;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	.stats-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}

	.stats-table th {
		background-color: #F8FAFC;
		padding: 16px;
		font-weight: 600;
		border-bottom: 1px solid var(--border-color);
		color: var(--text-secondary);
	}

	.stats-table td {
		padding: 16px;
		border-bottom: 1px solid var(--border-color);
		vertical-align: middle;
	}

	.stats-table tr:last-child td {
		border-bottom: none;
	}

	.badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 0.85em;
	}

	.badge-green {
		background: rgba(5, 150, 105, 0.1);
		color: var(--accent-color);
	}

	.badge-red {
		background: rgba(220, 38, 38, 0.1);
		color: #DC2626;
	}

	.text-center { text-align: center; }
</style>