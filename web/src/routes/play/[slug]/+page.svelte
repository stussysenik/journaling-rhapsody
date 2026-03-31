<script lang="ts">
	import BlankInput from '$lib/components/BlankInput.svelte';

	let { data } = $props();
	let template = $derived(data.template);

	// Pre-initialize all blank keys so Svelte 5 reactivity tracks them
	let initialAnswers: Record<string, string> = {};
	for (const blank of data.template.blanks) {
		if (blank.type === 'date') {
			initialAnswers[blank.id] = new Date().toISOString().split('T')[0];
		} else {
			initialAnswers[blank.id] = '';
		}
	}
	let answers: Record<string, string> = $state(initialAnswers);

	// Count filled blanks for progress
	let filledCount = $derived(
		template.blanks.filter((b) => {
			const v = answers[b.id];
			return v && v.trim() !== '';
		}).length
	);
	let totalBlanks = $derived(template.blanks.length);

	async function downloadPdf(mode: 'filled' | 'blank') {
		const params = new URLSearchParams({ mode });
		if (mode === 'filled') {
			params.set('answers', JSON.stringify(answers));
		}
		const url = `/print/${template.slug}?${params}`;
		window.open(url, '_blank');
	}
</script>

<svelte:head>
	<title>{template.title} — feelcheck</title>
</svelte:head>

<main class="play-page">
	<a href="/worksheets" class="back">&larr; Back to worksheets</a>

	<div class="play-layout">
		<!-- Left: MadLibs form -->
		<div class="form-panel">
			<header>
				<span class="category">{template.category}</span>
				<h1>{template.title}</h1>
				<p class="description">{template.description}</p>
				<div class="progress">
					<div class="progress-bar">
						<div
							class="progress-fill"
							style="width: {totalBlanks > 0 ? (filledCount / totalBlanks) * 100 : 0}%"
						></div>
					</div>
					<span class="progress-text">{filledCount}/{totalBlanks} filled</span>
				</div>
			</header>

			<div class="blanks">
				{#each template.blanks as blank}
					<BlankInput
						{blank}
						bind:value={answers[blank.id]}
					/>
				{/each}
			</div>

			<div class="actions">
				<button class="btn btn-primary" onclick={() => downloadPdf('filled')}>
					Download Filled PDF
				</button>
				<button class="btn btn-secondary" onclick={() => downloadPdf('blank')}>
					Download Blank
				</button>
				<button class="btn btn-secondary" onclick={() => window.print()}>
					Print
				</button>
			</div>
		</div>

		<!-- Right: Live preview -->
		<div class="preview-panel">
			<div class="preview-card">
				<div class="preview-header">
					<h3>{template.title}</h3>
					<p class="preview-date">{answers.date || new Date().toLocaleDateString()}</p>
				</div>
				<div class="preview-body">
					{#each template.blanks as blank}
						{@const val = answers[blank.id]}
						{#if val && val.trim()}
							<div class="preview-field">
								<span class="preview-label">{blank.prompt}</span>
								<span class="preview-value">{val}</span>
							</div>
						{:else}
							<div class="preview-field empty">
								<span class="preview-label">{blank.prompt}</span>
								<span class="preview-blank">___</span>
							</div>
						{/if}
					{/each}
				</div>
				<p class="preview-hint">Live preview updates as you type</p>
			</div>
		</div>
	</div>
</main>

<style>
	.play-page {
		max-width: 1100px;
		margin: 0 auto;
		padding: var(--space-lg);
	}

	.back {
		display: inline-block;
		font-size: 0.875rem;
		color: var(--color-caption);
		margin-bottom: var(--space-md);
	}

	.play-layout {
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: var(--space-xl);
		align-items: start;
	}

	@media (max-width: 768px) {
		.play-layout {
			grid-template-columns: 1fr;
		}
		.preview-panel {
			display: none;
		}
	}

	/* Form panel */
	.form-panel header {
		margin-bottom: var(--space-lg);
	}

	.category {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-accent);
		font-weight: 600;
	}

	h1 {
		font-size: 1.75rem;
		margin-top: var(--space-xs);
	}

	.description {
		color: var(--color-caption);
		margin-top: var(--space-xs);
	}

	.progress {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-top: var(--space-md);
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		background: var(--color-grid);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-accent);
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 0.75rem;
		color: var(--color-caption);
		white-space: nowrap;
	}

	.blanks {
		margin-bottom: var(--space-xl);
	}

	.actions {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.btn {
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--corner-r);
		font-weight: 600;
		font-size: 0.9375rem;
		transition: opacity 0.15s;
	}

	.btn:hover {
		opacity: 0.85;
	}

	.btn-primary {
		background: var(--color-text);
		color: var(--color-white);
	}

	.btn-secondary {
		background: var(--color-white);
		color: var(--color-text);
		border: 1px solid var(--color-grid);
	}

	/* Preview panel */
	.preview-panel {
		position: sticky;
		top: var(--space-lg);
	}

	.preview-card {
		background: var(--color-white);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		padding: var(--space-lg);
		font-size: 0.8125rem;
	}

	.preview-header {
		text-align: center;
		padding-bottom: var(--space-sm);
		border-bottom: 1px solid var(--color-grid);
		margin-bottom: var(--space-md);
	}

	.preview-header h3 {
		font-size: 1rem;
	}

	.preview-date {
		font-size: 0.6875rem;
		color: var(--color-caption);
	}

	.preview-field {
		padding: var(--space-xs) 0;
		border-bottom: 1px solid var(--color-bg-fill);
	}

	.preview-label {
		font-size: 0.6875rem;
		color: var(--color-caption);
		display: block;
	}

	.preview-value {
		color: var(--color-accent);
		font-weight: 600;
	}

	.preview-blank {
		color: var(--color-divider);
	}

	.preview-field.empty {
		opacity: 0.5;
	}

	.preview-hint {
		text-align: center;
		font-size: 0.6875rem;
		color: var(--color-divider);
		margin-top: var(--space-md);
	}
</style>
