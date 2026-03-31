<script lang="ts">
	let { data } = $props();
	let filter = $state('all');

	let filtered = $derived(
		filter === 'all'
			? data.templates
			: data.templates.filter((t) => t.status === filter)
	);
</script>

<svelte:head>
	<title>Dashboard — feelcheck admin</title>
</svelte:head>

<div class="dashboard">
	<div class="dashboard-header">
		<h1>Worksheets</h1>
		<a href="/admin/templates/new" class="btn-new">+ New Template</a>
	</div>

	<div class="filters">
		{#each ['all', 'published', 'draft', 'hidden'] as f}
			<button
				class="filter"
				class:active={filter === f}
				onclick={() => (filter = f)}
			>
				{f === 'all' ? `All (${data.templates.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${data.templates.filter(t => f === 'all' || t.status === f).length})`}
			</button>
		{/each}
	</div>

	<div class="template-list">
		{#each filtered as template}
			<div class="template-row">
				<div class="template-info">
					<div class="template-title-row">
						<span class="template-title">{template.title}</span>
						<span class="badge badge-{template.status}">{template.status}</span>
						{#if template.isBuiltIn}
							<span class="badge badge-builtin">built-in</span>
						{/if}
					</div>
					<span class="template-meta">{template.psychology} &middot; {template.blankCount} blanks</span>
				</div>
				<div class="template-actions">
					<a href="/play/{template.slug}" target="_blank" class="action-btn">Preview</a>
					<a href="/admin/templates/{template.id}" class="action-btn">Edit</a>
				</div>
			</div>
		{:else}
			<p class="empty">No templates match this filter.</p>
		{/each}
	</div>
</div>

<style>
	.dashboard-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-lg);
	}

	h1 {
		font-size: 1.5rem;
	}

	.btn-new {
		padding: var(--space-xs) var(--space-md);
		background: var(--color-text);
		color: var(--color-white);
		border-radius: var(--corner-r);
		font-size: 0.875rem;
		font-weight: 600;
	}

	.btn-new:hover {
		opacity: 0.85;
		text-decoration: none;
	}

	.filters {
		display: flex;
		gap: var(--space-xs);
		margin-bottom: var(--space-lg);
	}

	.filter {
		padding: var(--space-xs) var(--space-md);
		border: 1px solid var(--color-grid);
		border-radius: 999px;
		font-size: 0.8125rem;
		color: var(--color-caption);
		background: var(--color-white);
	}

	.filter.active {
		background: var(--color-text);
		color: var(--color-white);
		border-color: var(--color-text);
	}

	.template-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.template-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-md);
		background: var(--color-white);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
	}

	.template-title-row {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.template-title {
		font-weight: 700;
		font-size: 0.9375rem;
	}

	.badge {
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 0.6875rem;
	}

	.badge-published {
		background: #e6f4ea;
		color: #1e7e34;
	}

	.badge-draft {
		background: #fff8e1;
		color: #b8860b;
	}

	.badge-hidden {
		background: #fce4ec;
		color: #c53030;
	}

	.badge-builtin {
		background: var(--color-bg-fill);
		color: var(--color-caption);
	}

	.template-meta {
		font-size: 0.75rem;
		color: var(--color-caption);
		display: block;
		margin-top: 2px;
	}

	.template-actions {
		display: flex;
		gap: var(--space-xs);
	}

	.action-btn {
		padding: 4px 12px;
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 0.75rem;
		color: var(--color-text);
	}

	.action-btn:hover {
		border-color: var(--color-accent);
		text-decoration: none;
	}

	.empty {
		color: var(--color-caption);
		text-align: center;
		padding: var(--space-2xl);
		background: var(--color-white);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
	}
</style>
