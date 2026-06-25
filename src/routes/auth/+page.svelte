<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	
	// Steuert, ob das Login- oder Registrierungsformular angezeigt wird
	let isRegister = $state(false);
</script>

<main class="main-content" style="display:flex; align-items:center; justify-content:center; flex:1;">
	<div class="card form-container">
		<h2 class="text-center" style="font-size: 2rem;">
			{#if isRegister}
				Konto erstellen
			{:else}
				Willkommen zurück
			{/if}
		</h2>
		<p class="text-center" style="color:var(--text-secondary); margin-bottom:var(--spacing-lg);">
			{#if isRegister}
				Bitte füllen Sie die Felder aus, um sich zu registrieren.
			{:else}
				Bitte melden Sie sich an, um fortzufahren.
			{/if}
		</p>
		
		<form method="post" action={isRegister ? '?/signUpEmail' : '?/signInEmail'} use:enhance>
			
			{#if isRegister}
				<div class="form-group">
					<label for="name">Name</label>
					<input type="text" id="name" name="name" required autocomplete="name">
				</div>
			{/if}

			<div class="form-group">
				<label for="email">E-Mail Adresse</label>
				<input type="email" id="email" name="email" required autocomplete="email">
			</div>
			
			<div class="form-group">
				<label for="password">Passwort</label>
				<input type="password" id="password" name="password" required autocomplete={isRegister ? "new-password" : "current-password"}>
			</div>

			{#if form?.message}
				<p class="text-center mt-md" style="color: #DC2626; font-weight: 500;">
					{form.message}
				</p>
			{/if}
			
			<div class="form-group" style="margin-top: var(--spacing-xl);">
				<button type="submit" class="btn" style="width: 100%;">
					{#if isRegister}
						Registrieren
					{:else}
						Anmelden
					{/if}
				</button>
			</div>
		</form>

		<div class="text-center mt-md">
			{#if isRegister}
				<p>Bereits ein Konto? <a href="#" onclick={(e) => { e.preventDefault(); isRegister = false; }}>Hier anmelden</a></p>
			{:else}
				<p>Noch kein Konto? <a href="#" onclick={(e) => { e.preventDefault(); isRegister = true; }}>Hier registrieren</a></p>
			{/if}
		</div>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

	/* Globale Variablen und Resets */
	:global(:root) {
		--bg-main: #F3F4F6; 
		--text-primary: #1F2937;
		--text-secondary: #4B5563;
		--primary-color: #1E3A8A;
		--primary-hover: #1E40AF;
		--card-bg: #FFFFFF;
		--border-color: #D1D5DB;
		--font-base: 16px;
		--font-heading: 'Inter', sans-serif;
		--font-body: 'Inter', sans-serif;
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

	/* Typografie & Links */
	h2 {
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

	/* Layout & Cards */
	.main-content {
		flex: 1;
		max-width: 1000px;
		margin: 0 auto;
		width: 100%;
		padding: var(--spacing-xl);
	}

	.card {
		background: var(--card-bg);
		border-radius: var(--border-radius);
		padding: var(--spacing-xl);
		margin-bottom: var(--spacing-xl);
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-sm);
	}

	.form-container {
		max-width: 500px;
		margin: 0 auto;
	}

	/* Buttons */
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

	/* Formulare */
	.form-group {
		margin-bottom: var(--spacing-lg);
		text-align: left;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: var(--spacing-sm);
		color: var(--text-primary);
	}

	input[type="text"], input[type="email"], input[type="password"] {
		width: 100%;
		padding: 14px;
		font-size: var(--font-base);
		border: 2px solid var(--border-color);
		border-radius: 8px;
		background-color: #F8FAFC;
		transition: var(--transition);
		font-family: var(--font-body);
	}

	input:focus {
		border-color: var(--primary-color);
		outline: none;
		background-color: #FFF;
		box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.1);
	}

	/* Helfer-Klassen */
	.text-center { text-align: center; }
	.mt-md { margin-top: var(--spacing-md); }
</style>