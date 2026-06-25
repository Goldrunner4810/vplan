<script lang="ts">
	// Landingpage für das Hackathon Projekt
</script>

<nav class="top-nav">
	<h1>Vereinsmanager</h1>
	<div class="nav-links">
		<!-- Button zum Login (/auth) in der Navigationsleiste -->
		<a href="/auth" class="btn" style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.4); color: white; box-shadow: none;">
			Zum Login
		</a>
	</div>
</nav>

<main class="main-content">
	<!-- Hero Section / Einleitung -->
	<section class="hero text-center" style="padding: 4rem 0 3rem 0;">
		<h2 style="font-size: 2.8rem; color: var(--primary-color); margin-bottom: 1.5rem; line-height: 1.2;">
			Gemeinden und Vereine<br>besser vernetzen
		</h2>
		<p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 750px; margin: 0 auto 2.5rem auto; line-height: 1.6;">
			In Dörfern bekommen oft einige Personen die neuesten Nachrichten nicht mit. Unser Hackathon-Projekt behebt genau das: Wir helfen Gemeinden und Vereinen dabei, sich besser untereinander auszukennen, effizient zu kommunizieren und wichtige Informationen blitzschnell auszutauschen.
		</p>
		
		<!-- Großer Login Button -->
		<a href="/auth" class="btn" style="font-size: 1.1rem; padding: 14px 36px; border-radius: 8px;">
			Jetzt einloggen
		</a>
	</section>

	<!-- Features / Funktionen -->
	<section class="features-grid" style="margin-bottom: 4rem;">
		
		<!-- Feature 1: Posts & Infos -->
		<div class="card text-center" style="margin-bottom: 0;">
			<div style="font-size: 3rem; margin-bottom: 1rem;">📢</div>
			<h3>Informationsverbreitung</h3>
			<p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 0;">
				Admins – meist Organisatoren oder andere wichtige Personen – können Beiträge verfassen. So wird die Verbreitung von News extrem erleichtert und niemand im Dorf verpasst mehr die neuesten Nachrichten.
			</p>
		</div>

		<!-- Feature 2: Zusagen & CSV -->
		<div class="card text-center" style="margin-bottom: 0;">
			<div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
			<h3>Einfache Organisation</h3>
			<p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 0;">
				Nutzer können ganz einfach abstimmen, ob sie zu einem Event mitkommen oder nicht. Für die Orga können Admins diese Daten bequem in einer CSV-Datei exportieren und als übersichtliche Tabelle nutzen.
			</p>
		</div>

		<!-- Feature 3: Kalender -->
		<div class="card text-center" style="margin-bottom: 0;">
			<div style="font-size: 3rem; margin-bottom: 1rem;">📅</div>
			<h3>Terminkalender</h3>
			<p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 0;">
				Ein integrierter Kalender sorgt für die einfache und klare Darstellung aller vorstehenden Termine, damit alle Mitglieder ihre Planung stets perfekt im Griff haben.
			</p>
		</div>

	</section>

	<!-- Team Credits -->
	<section class="card text-center" style="background: rgba(30, 58, 138, 0.03); border: 1px dashed var(--primary-color);">
		<h3 style="margin-bottom: 1rem; color: var(--primary-color);">Unser Hackathon Team</h3>
		<p style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 0;">
			Entwickelt von<br>
			<strong style="color: var(--primary-color);">Flaviu Moldovan</strong> &nbsp;•&nbsp; 
			<strong style="color: var(--primary-color);">Simon Gabryel</strong> &nbsp;•&nbsp; 
			<strong style="color: var(--primary-color);">Matthias Bognar</strong>
		</p>
	</section>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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

	/* MAIN CONTENT & CARDS */
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

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--spacing-xl);
		align-items: stretch;
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

	.text-center { text-align: center; }

	/* MOBILE ANPASSUNG */
	@media (max-width: 768px) {
		.hero h2 { font-size: 2rem !important; }
		.hero p { font-size: 1rem !important; }
		.top-nav { padding: var(--spacing-md); }
	}
</style>