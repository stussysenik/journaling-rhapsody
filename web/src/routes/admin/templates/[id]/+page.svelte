<script lang="ts">
	let { data } = $props();
	let template = $derived(data.template);
</script>

<svelte:head>
	<title>{template.title} — feelcheck admin</title>
</svelte:head>

<div class="edit-page">
	<div class="edit-header">
		<a href="/admin" class="back">&larr; Dashboard</a>
		<h1>{template.title}</h1>
		<div class="badges">
			<span class="badge badge-{template.status}">{template.status}</span>
			<span class="badge badge-builtin">built-in</span>
		</div>
	</div>

	<div class="edit-layout">
		<div class="detail-panel">
			<section class="detail-section">
				<h2>Info</h2>
				<dl>
					<dt>Slug</dt>
					<dd><code>{template.slug}</code></dd>
					<dt>Category</dt>
					<dd>{template.category}</dd>
					<dt>Psychology</dt>
					<dd>{template.psychology}</dd>
					<dt>Estimated time</dt>
					<dd>{template.estimatedMinutes} minutes</dd>
				</dl>
			</section>

			<section class="detail-section">
				<h2>Blanks ({template.blanks.length})</h2>
				<div class="blank-list">
					{#each template.blanks as blank}
						<div class="blank-item">
							<span class="blank-type">{blank.type}</span>
							<span class="blank-prompt">{blank.prompt}</span>
							<code class="blank-id">{blank.id}</code>
						</div>
					{/each}
				</div>
			</section>

			<section class="detail-section">
				<h2>Sections ({template.sections.length})</h2>
				<div class="section-list">
					{#each template.sections as section}
						<div class="section-item">
							<code>{section.type}</code>
						</div>
					{/each}
				</div>
			</section>
		</div>

		<div class="action-panel">
			<a href="/play/{template.slug}" target="_blank" class="action-btn primary">Preview on Site</a>
			<a href="/print/{template.slug}" target="_blank" class="action-btn">Download PDF</a>
		</div>
	</div>
</div>

<style>
	.edit-header {
		margin-bottom: var(--space-lg);
	}

	.back {
		font-size: 0.875rem;
		color: var(--color-caption);
	}

	h1 {
		font-size: 1.75rem;
		margin-top: var(--space-xs);
	}

	.badges {
		display: flex;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.badge {
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 0.6875rem;
	}

	.badge-published { background: #e6f4ea; color: #1e7e34; }
	.badge-draft { background: #fff8e1; color: #b8860b; }
	.badge-hidden { background: #fce4ec; color: #c53030; }
	.badge-builtin { background: var(--color-bg-fill); color: var(--color-caption); }

	.edit-layout {
		display: grid;
		grid-template-columns: 1fr 240px;
		gap: var(--space-lg);
		align-items: start;
	}

	.detail-section {
		background: var(--color-white);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		padding: var(--space-lg);
		margin-bottom: var(--space-md);
	}

	.detail-section h2 {
		font-size: 1rem;
		margin-bottom: var(--space-md);
	}

	dl {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: var(--space-xs);
		font-size: 0.875rem;
	}

	dt {
		color: var(--color-caption);
		font-weight: 600;
	}

	dd {
		color: var(--color-text);
	}

	code {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		background: var(--color-bg-fill);
		padding: 1px 4px;
		border-radius: 3px;
	}

	.blank-list, .section-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.blank-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) var(--space-sm);
		border: 1px solid var(--color-bg-fill);
		border-radius: var(--corner-r);
		font-size: 0.8125rem;
	}

	.blank-type {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--color-accent);
		background: var(--color-bg-fill);
		padding: 2px 6px;
		border-radius: 3px;
		min-width: 60px;
		text-align: center;
	}

	.blank-prompt {
		flex: 1;
	}

	.blank-id {
		font-size: 0.6875rem;
	}

	.section-item {
		padding: var(--space-xs) var(--space-sm);
		border: 1px solid var(--color-bg-fill);
		border-radius: var(--corner-r);
	}

	.section-item code {
		color: var(--color-accent);
	}

	.action-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		position: sticky;
		top: var(--space-lg);
	}

	.action-btn {
		display: block;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-text);
	}

	.action-btn:hover {
		border-color: var(--color-accent);
		text-decoration: none;
	}

	.action-btn.primary {
		background: var(--color-text);
		color: var(--color-white);
		border-color: var(--color-text);
	}
</style>
