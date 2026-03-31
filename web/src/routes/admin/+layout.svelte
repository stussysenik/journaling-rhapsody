<script lang="ts">
	let { children } = $props();
</script>

<div class="admin-shell">
	<header class="admin-header">
		<a href="/admin" class="admin-logo">feel<span>check</span> admin</a>
		<nav>
			<a href="/admin">Dashboard</a>
			<a href="/admin/templates/new">New Template</a>
			<a href="/" target="_blank">View Site</a>
			<form method="POST" action="/admin/logout" style="display:inline">
				<button type="submit" class="logout-btn">Logout</button>
			</form>
		</nav>
	</header>
	<main class="admin-content">
		{@render children()}
	</main>
</div>

<style>
	.admin-shell {
		min-height: 100vh;
		background: #fafafa;
	}

	.admin-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-sm) var(--space-lg);
		background: var(--color-text);
		color: var(--color-white);
	}

	.admin-logo {
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-white);
	}

	.admin-logo span {
		color: var(--color-accent);
	}

	nav {
		display: flex;
		gap: var(--space-md);
	}

	nav a {
		color: var(--color-grid);
		font-size: 0.875rem;
	}

	nav a:hover {
		color: var(--color-white);
		text-decoration: none;
	}

	.logout-btn {
		color: var(--color-grid);
		font-size: 0.875rem;
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
	}

	.logout-btn:hover {
		color: var(--color-white);
	}

	.admin-content {
		max-width: 1100px;
		margin: 0 auto;
		padding: var(--space-lg);
	}
</style>
