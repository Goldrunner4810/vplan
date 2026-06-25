<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<nav class="top-nav">
	<h1>Vereinsmanager</h1>
	<div class="nav-links">
		<a href="/dash" class="nav-link">Dashboard</a>
		<form method="post" action="?/signOut" use:enhance style="margin: 0; display: inline;">
			<button class="nav-link" style="background: transparent; border: none; cursor: pointer; font-size: inherit;">Sign out</button>
		</form>
	</div>
</nav>

<main class="main-content">
	<div style="margin-bottom: var(--spacing-lg); display: flex; justify-content: space-between; align-items: center;">
		<h2>Neues Event erstellen</h2>
		<a href="/dash" class="btn btn-secondary">← Abbrechen</a>
	</div>

	<div class="form-container card">
		{#if form?.message}
			<div class="message-banner">
				<p>{form.message}</p>
			</div>
		{/if}

		<form method="post" action="?/create" use:enhance>
			<div class="form-group">
				<label for="title">Titel</label>
				<input id="title" name="title" type="text" required placeholder="z.B. Monatsversammlung" />
			</div>

			<div class="form-group">
				<label for="content">Beschreibung</label>
				<textarea id="content" name="content" required rows="5" placeholder="Details zum Event..."></textarea>
			</div>

			<div class="form-group">
				<label for="zeit">Datum & Uhrzeit</label>
				<input id="zeit" name="zeit" type="datetime-local" />
			</div>

			<div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-xl);">
				<button class="btn" style="flex: 1;">Event erstellen</button>
				<a href="/dash" class="btn btn-secondary" style="text-align: center;">Abbrechen</a>
			</div>
		</form>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

	:global(:root) {
		/* Color Palette - Traditional & Serious */
		--bg-main: #F3F4F6; 
		--text-primary: #1F2937;
		--text-secondary: #4B5563;
		
		--primary-color: #1E3A8A; 
		--primary-hover: #1E40AF;
		
		--accent-color: #059669; 
		--accent-hover: #047857;

		--card-bg: #FFFFFF;
		--border-color: #D1D5DB;
		
		/* Typography */
		--font-base: 16px; 
		--font-heading: 'Inter', sans-serif;
		--font-body: 'Inter', sans-serif;
		
		/* Styling Variables */
		--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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

	h2 {
		font-family: var(--font-heading);
		font-weight: 600;
		line-height: 1.2;
		margin-bottom: 0;
		color: var(--text-primary);
	}

	a {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
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
		font-family: var(--font-heading);
		font-weight: 600;
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

	.nav-link:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #FFFFFF;
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
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-sm);
	}

	/* BUTTONS */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 10px 20px;
		font-size: 0.95rem;
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
	}

	.btn:active {
		transform: translateY(1px);
	}

	.btn-secondary {
		background: transparent;
		color: var(--primary-color);
		border: 2px solid var(--primary-color);
	}

	.btn-secondary:hover {
		background: rgba(2, 132, 199, 0.05);
		color: var(--primary-hover);
	}

	/* FORMS & INPUTS */
	.form-container {
		max-width: 650px;
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
		font-size: 0.95rem;
	}

	input[type="text"], input[type="datetime-local"], textarea {
		width: 100%;
		padding: 12px;
		font-size: var(--font-base);
		border: 2px solid var(--border-color);
		border-radius: var(--border-radius);
		background-color: #F8FAFC;
		transition: var(--transition);
		font-family: var(--font-body);
	}

	input:focus, textarea:focus {
		border-color: var(--primary-color);
		outline: none;
		background-color: #FFF;
		box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1);
	}

	textarea {
		resize: vertical;
	}

	/* BANNER */
	.message-banner {
		background-color: #EFF6FF;
		border-left: 4px solid var(--primary-color);
		padding: var(--spacing-md);
		border-radius: var(--border-radius);
		margin-bottom: var(--spacing-lg);
		color: var(--primary-color);
		font-weight: 500;
	}
</style>