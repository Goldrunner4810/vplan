<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	function formatEventTime(value: unknown) {
		if (value == null) return null;

		const date = value instanceof Date ? value : new Date(String(value));
		if (Number.isNaN(date.getTime())) return null;

		return date.toLocaleString('de-AT', {
			dateStyle: 'medium',
			timeStyle: 'short'
		});
	}

	function formatDateTime(value: unknown) {
		const date = value instanceof Date ? value : new Date(String(value));
		if (Number.isNaN(date.getTime())) return '-';

		return date.toLocaleString('de-AT');
	}
</script>

<nav class="top-nav">
	<h1>Vereinsmanager</h1>
	<div class="nav-links">
		{#if data.user}
			<span class="user-badge" style="color: #E5E7EB; margin-right: 1rem;">
				Hi, {data.user.name}!
			</span>
		{/if}
		<a href="/dash" class="nav-link active">Dashboard</a>
		<form method="post" action="?/signOut" use:enhance style="margin: 0; display: inline;">
			<button class="nav-link" style="background: transparent; border: none; cursor: pointer; font-size: inherit;">Sign out</button>
		</form>
	</div>
</nav>

<main class="main-content">
	{#if !data.event}
		<div class="card text-center">
			<p>No event found.</p>
			<a href="/dash" class="btn btn-secondary mt-md">Zurück zum Dashboard</a>
		</div>
	{:else}
		<div style="margin-bottom: var(--spacing-lg); display: flex; justify-content: space-between; align-items: center;">
			<h2>Event-Details</h2>
			<a href="/dash" class="btn btn-secondary">← Dashboard</a>
		</div>

		<div class="dashboard-grid">
			<aside style="display: flex; flex-direction: column; gap: var(--spacing-md);">
				<div class="card" style="margin-bottom: 0;">
					<h3 style="font-size: 1.1rem; margin-bottom: var(--spacing-sm);">Ihre Rückmeldung</h3>
					<p style="margin-bottom: var(--spacing-md); color: var(--text-secondary); font-size: 0.95rem;">
						Status: 
						<strong style="color: var(--primary-color);">
							{#if data.myStatus === 'kommen'}
								Kommen
							{:else if data.myStatus === 'absagen'}
								Absagen
							{:else}
								Keine Antwort
							{/if}
						</strong>
					</p>

					<form method="post" action="?/attendance" use:enhance style="display: flex; gap: var(--spacing-sm);">
						<button name="status" value="kommen" class="btn btn-small" style="flex: 1; background: var(--accent-color);">Kommen</button>
						<button name="status" value="absagen" class="btn btn-secondary btn-small" style="flex: 1; border-color: #DC2626; color: #DC2626;">Absagen</button>
					</form>
				</div>

				<div class="card" style="margin-bottom: 0;">
					<h3 style="font-size: 1.1rem; margin-bottom: var(--spacing-sm);">Zusagen ({data.coming.length})</h3>
					{#if data.coming.length === 0}
						<p class="post-meta">Noch keine Zusagen.</p>
					{:else}
						<ul class="sidebar-list">
							{#each data.coming as participant}
								<li>{participant.user_name ?? 'Unbekannter User'}</li>
							{/each}
						</ul>
					{/if}
				</div>

				<div class="card" style="margin-bottom: 0;">
					<h3 style="font-size: 1.1rem; margin-bottom: var(--spacing-sm);">Absagen ({data.notComing.length})</h3>
					{#if data.notComing.length === 0}
						<p class="post-meta">Noch keine Absagen.</p>
					{:else}
						<ul class="sidebar-list">
							{#each data.notComing as participant}
								<li>{participant.user_name ?? 'Unbekannter User'}</li>
							{/each}
						</ul>
					{/if}
				</div>
			</aside>

			<div style="display: flex; flex-direction: column; gap: var(--spacing-xl);">
				<article class="card" style="margin-bottom: 0;">
					<header class="post-header" style="align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-md); margin-bottom: var(--spacing-md);">
						<div style="flex: 1; padding-right: var(--spacing-md);">
							<h3 style="font-size: 1.75rem; margin-bottom: var(--spacing-xs);">{data.event.title}</h3>
							<span class="post-meta">Gepostet am {formatDateTime(data.event.created_at)}</span>
						</div>
						
						{#if formatEventTime(data.event.zeit)}
							<div style="text-align: right; min-width: max-content;">
								<time datetime={String(data.event.zeit)} style="font-size: 1.2rem; font-weight: 700; color: var(--primary-color);">
									{formatEventTime(data.event.zeit)}
								</time>
							</div>
						{/if}
					</header>
					
					<div class="post-body">
						<p style="white-space: pre-wrap; color: var(--text-primary); line-height: 1.6;">{data.event.content}</p>
					</div>
				</article>

				<div class="card" style="margin-bottom: 0;">
					<h3 style="margin-bottom: var(--spacing-lg);">Kommentare ({data.comments.length})</h3>

					<form method="post" action="?/comment" use:enhance style="margin-bottom: var(--spacing-xl);">
						<div class="form-group">
							<label for="comment-content">Kommentar hinzufügen</label>
							<textarea id="comment-content" name="content" required placeholder="Schreiben Sie einen Kommentar..." rows="3"></textarea>
						</div>
						<button class="btn">Absenden</button>
					</form>

					{#if data.comments.length === 0}
						<p class="post-meta">Noch keine Kommentare.</p>
					{:else}
						<div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
							{#each data.comments as comment}
								<div class="comment">
									<div class="comment-meta">
										<strong>{comment.user_name ?? 'Unbekannter User'}</strong> • {formatDateTime(comment.created_at)}
									</div>
									<p style="white-space: pre-wrap; margin: 0; color: var(--text-primary);">{comment.content}</p>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
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
		--font-base: 16px; 
		--font-heading: 'Inter', sans-serif;
		--font-body: 'Inter', sans-serif;
		
		/* Styling Variables */
		--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		--shadow-lg: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		--border-radius: 4px; /* Sharp, traditional edges */
		--spacing-xs: 0.25rem;
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

	/* CARDS */
	.card {
		background: var(--card-bg);
		border-radius: var(--border-radius);
		padding: var(--spacing-xl);
		margin-bottom: var(--spacing-xl);
		border: 1px solid var(--border-color);
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

	.btn-small {
		padding: 6px 12px;
		font-size: 0.85rem;
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
		font-size: 0.95rem;
	}

	.sidebar-list li:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	/* FORMS & INPUTS */
	.form-group {
		margin-bottom: var(--spacing-lg);
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: var(--spacing-sm);
		color: var(--text-primary);
	}

	textarea {
		width: 100%;
		padding: 14px;
		font-size: var(--font-base);
		border: 2px solid var(--border-color);
		border-radius: 8px;
		background-color: #F8FAFC;
		transition: var(--transition);
		font-family: var(--font-body);
		resize: vertical;
	}

	textarea:focus {
		border-color: var(--primary-color);
		outline: none;
		background-color: #FFF;
		box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.1);
	}

	/* UTILS */
	.text-center { text-align: center; }
	.mt-md { margin-top: var(--spacing-md); }

	/* COMMENTS */
	.comment {
		background-color: #F8FAFC;
		padding: var(--spacing-md);
		border-radius: 8px;
		margin-bottom: var(--spacing-md);
		border-left: 4px solid var(--primary-color);
	}
	
	.comment:last-child {
		margin-bottom: 0;
	}

	.comment-meta {
		font-size: 0.85em;
		color: var(--text-secondary);
		margin-bottom: 4px;
	}
</style>