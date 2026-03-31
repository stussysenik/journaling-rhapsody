<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Worksheets — feelcheck</title>
</svelte:head>

<main class="worksheets-page">
	<header class="page-header">
		<a href="/" class="logo">feel<span class="accent">check</span></a>
		<h1>Worksheets</h1>
		<p class="subtitle">Psychology-backed MadLibs journal templates. Pick one, fill in the blanks, get your personalized PDF.</p>
	</header>

	<div class="grid">
		{#each data.templates as template}
			<a href="/play/{template.slug}" class="card">
				<span class="category">{template.category}</span>
				<h2>{template.title}</h2>
				<p class="description">{template.description}</p>
				<div class="meta">
					<span>{template.blankCount} prompts</span>
					<span>{template.estimatedMinutes} min</span>
				</div>
				<p class="psychology">{template.psychology}</p>
			</a>
		{/each}
	</div>
</main>

<style>
	.worksheets-page {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-lg);
	}

	.page-header {
		text-align: center;
		margin-bottom: var(--space-xl);
	}

	.logo {
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-text);
	}

	.accent {
		color: var(--color-accent);
	}

	h1 {
		margin-top: var(--space-md);
		font-size: 2rem;
	}

	.subtitle {
		color: var(--color-caption);
		margin-top: var(--space-xs);
		max-width: 500px;
		margin-inline: auto;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: var(--space-md);
	}

	.card {
		display: flex;
		flex-direction: column;
		padding: var(--space-lg);
		background: var(--color-white);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		color: var(--color-text);
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.card:hover {
		border-color: var(--color-accent);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		text-decoration: none;
	}

	.category {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-accent);
		font-weight: 600;
	}

	.card h2 {
		font-size: 1.125rem;
		margin-top: var(--space-xs);
	}

	.description {
		font-size: 0.8125rem;
		color: var(--color-caption);
		margin-top: var(--space-xs);
		flex: 1;
	}

	.meta {
		display: flex;
		gap: var(--space-md);
		margin-top: var(--space-sm);
		font-size: 0.75rem;
		color: var(--color-divider);
	}

	.psychology {
		font-size: 0.6875rem;
		color: var(--color-divider);
		margin-top: var(--space-sm);
		font-style: italic;
	}
</style>
