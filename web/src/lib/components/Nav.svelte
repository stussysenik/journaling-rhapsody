<nav class="nav">
	<a href="/" class="nav-logo">feel<span class="accent">check</span></a>
	<div class="nav-links">
		<a href="/worksheets">Worksheets</a>
	</div>
</nav>

<style>
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-sm) var(--space-lg);
		border-bottom: 1px solid var(--color-grid);
		background: var(--color-white);
	}

	.nav-logo {
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-text);
	}

	.accent {
		color: var(--color-accent);
	}

	.nav-links {
		display: flex;
		gap: var(--space-md);
	}

	.nav-links a {
		font-size: 0.875rem;
		color: var(--color-caption);
	}

	.nav-links a:hover {
		color: var(--color-text);
		text-decoration: none;
	}
</style>
