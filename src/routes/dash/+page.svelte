<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	function formatEventDateOnly(value: unknown) {
		if (value == null) return null;
		const date = value instanceof Date ? value : new Date(String(value));
		if (Number.isNaN(date.getTime())) return null;
		return date.toLocaleDateString('de-AT', {
			dateStyle: 'medium'
		});
	}

	function formatEventTimeOnly(value: unknown) {
		if (value == null) return null;
		const date = value instanceof Date ? value : new Date(String(value));
		if (Number.isNaN(date.getTime())) return null;
		return date.toLocaleTimeString('de-AT', {
			timeStyle: 'short'
		});
	}
</script>

<nav class="top-nav">
	<h1>Vereinsmanager</h1>
	<div class="nav-links">
		<span class="user-badge" style="color: #E5E7EB; margin-right: 1rem;">
			Hi, {data.user.name}!
		</span>
		
		{#if data.isAdmin}
			<a href="/post/new" class="nav-link">Add</a>
			<a href="/stats" class="nav-link">Statistik</a>
			
		{/if}
		<a href="/cal" class="nav-link">Callendar</a>
		
		<form method="post" action="?/signOut" use:enhance style="margin: 0; display: inline;">
			<button class="nav-link" style="background: transparent; border: none; cursor: pointer; font-size: inherit;">Sign out</button>
		</form>
	</div>
</nav>

<main class="main-content">
	<div class="dashboard-heading">
		<h2>Events</h2>
		<form method="get" class="sort-form" aria-label="Events sortieren">
			<label for="sort">Sortieren nach</label>
			<select
				id="sort"
				name="sort"
				value={data.sort}
				onchange={(event) => event.currentTarget.form?.requestSubmit()}
			>
				<option value="created">Kürzlich erstellt</option>
				<option value="date">Datum</option>
			</select>
		</form>
	</div>

	{#if data.events.length === 0}
		<div class="card">
			<p>No events found.</p>
		</div>
	{:else}
		<div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
			{#each data.events as event}
				<a href={"/post/" + event.id} class="card post-link-card" style="margin-bottom: 0;">
					<article>
						<header class="post-header" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0; align-items: flex-start;">
							<div style="flex: 1; padding-right: var(--spacing-lg);">
								<h3 style="margin-bottom: var(--spacing-sm);">{event.title}</h3>
								<div class="post-body mt-md" style="margin-top: 0;">
									<p style="color: var(--text-secondary);">{event.content}</p>
								</div>
							</div>
							
							{#if formatEventTimeOnly(event.zeit)}
								<div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start; min-width: max-content;">
									<time datetime={String(event.zeit)} style="font-size: 1.75rem; font-weight: 700; color: var(--primary-color); line-height: 1;">
										{formatEventTimeOnly(event.zeit)}
									</time>
									<span class="post-meta" style="margin-top: 6px; font-weight: 500;">
										{formatEventDateOnly(event.zeit)}
									</span>
								</div>
							{/if}
						</header>
					</article>
				</a>
			{/each}
		</div>
	{/if}
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

	:global(:root) {
		/* Color Palette - Traditional & Serious */
		--bg-main: #F3F4F6; 
		--text-primary: #1F2937;
		--text-secondary: #4B5563;
		
		--primary-color: #1E3A8A; /* Dark, serious blue */
		--primary-hover: #1E40AF;
		
		--accent-color: #059669; /* Forest green */
		--accent-hover: #047857;

		--card-bg: #FFFFFF;
		--border-color: #D1D5DB;
		
		/* Typography */
		--font-base: 16px; /* Traditional size */
		--font-heading: 'Inter', sans-serif;
		--font-body: 'Inter', sans-serif;
		
		/* Styling Variables */
		--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		--shadow-lg: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		--border-radius: 4px; /* Sharp, traditional edges */
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

	/* USER INFO BADGE */
	.user-badge {
		color: #E5E7EB;
		font-size: 0.9em;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* MAIN CONTENT */
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

	.sort-form {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		margin: 0;
	}

	.sort-form label {
		margin-bottom: 0;
		font-size: 0.9rem;
		white-space: nowrap;
	}

	.sort-form select {
		min-width: 180px;
		padding: 10px 12px;
	}

	/* CARDS */
	.card {
		background: var(--card-bg);
		border-radius: var(--border-radius);
		padding: var(--spacing-xl);
		margin-bottom: var(--spacing-xl);
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-sm);
	}

	/* Link Card Styles (Makes the whole box clickable) */
	.post-link-card {
		display: block;
		text-decoration: none !important;
		color: inherit !important;
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
	}

	.post-link-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
		border-color: var(--primary-color);
	}

	.post-link-card:active {
		transform: translateY(0);
		box-shadow: var(--shadow-sm);
	}

	.post-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-md);
		padding-bottom: var(--spacing-sm);
		border-bottom: 1px solid var(--border-color);
	}

	.post-meta {
		color: var(--text-secondary);
		font-size: 0.9em;
	}

	.post-actions {
		display: flex;
		gap: var(--spacing-md);
		margin-top: var(--spacing-lg);
		border-top: 1px solid var(--border-color);
		padding-top: var(--spacing-md);
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

	.btn:active {
		transform: translateY(1px);
	}

	.btn-secondary {
		background: transparent;
		color: var(--primary-color);
		border: 2px solid var(--primary-color);
		box-shadow: none;
	}

	.btn-secondary:hover {
		background: rgba(2, 132, 199, 0.05);
		color: var(--primary-hover);
		box-shadow: none;
	}

	.btn-accent {
		background: var(--accent-color);
	}
	
	.btn-accent:hover {
		box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
	}

	.btn-small {
		padding: 8px 16px;
		font-size: 1rem;
	}

	/* DASHBOARD 2-COLUMN */
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

	.sidebar-list {
		list-style: none;
		padding: 0;
	}
	
	.sidebar-list li {
		padding: 10px 0;
		border-bottom: 1px solid var(--border-color);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* FORMS & INPUTS */
	.form-container {
		max-width: 500px;
		margin: 0 auto;
	}

	.form-group {
		margin-bottom: var(--spacing-lg);
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: var(--spacing-sm);
		color: var(--text-primary);
	}

	input[type="text"], input[type="email"], input[type="password"], textarea, select {
		width: 100%;
		padding: 14px;
		font-size: var(--font-base);
		border: 2px solid var(--border-color);
		border-radius: 8px;
		background-color: #F8FAFC;
		transition: var(--transition);
		font-family: var(--font-body);
	}

	input:focus, textarea:focus, select:focus {
		border-color: var(--primary-color);
		outline: none;
		background-color: #FFF;
		box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.1);
	}

	@media (max-width: 640px) {
		.dashboard-heading {
			align-items: stretch;
			flex-direction: column;
		}

		.sort-form {
			align-items: stretch;
			flex-direction: column;
		}
	}

	/* MODAL */
	.modal-overlay {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(15, 23, 42, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.modal-overlay.open {
		opacity: 1;
		pointer-events: auto;
	}

	.modal-content {
		background: var(--card-bg);
		width: 100%;
		max-width: 600px;
		border-radius: var(--border-radius);
		padding: var(--spacing-xl);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		transform: translateY(20px);
		transition: transform 0.3s ease;
	}

	.modal-overlay.open .modal-content {
		transform: translateY(0);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-lg);
	}

	.close-modal {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary);
	}

	/* UTILS */
	.text-center { text-align: center; }
	.mt-sm { margin-top: var(--spacing-sm); }
	.mt-md { margin-top: var(--spacing-md); }
	.mt-lg { margin-top: var(--spacing-lg); }
	.hidden { display: none !important; }

	/* COMMENTS */
	.comment {
		background-color: #F8FAFC;
		padding: var(--spacing-md);
		border-radius: 8px;
		margin-bottom: var(--spacing-md);
		border-left: 4px solid var(--primary-color);
	}
	
	.comment-meta {
		font-size: 0.85em;
		color: var(--text-secondary);
		margin-bottom: 4px;
	}
</style>