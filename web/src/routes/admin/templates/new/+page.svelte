<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Blank, SectionType } from '$lib/schema/types.js';

	let { form } = $props();
	let title = $state('');
	let description = $state('');
	let psychology = $state('');
	let category = $state('mood');
	let blanks: Blank[] = $state([]);
	let sectionConfigs: Array<{ type: SectionType; [key: string]: unknown }> = $state([]);

	let canSave = $derived(title.trim().length > 0);

	const blankTypes = ['text', 'textarea', 'choice', 'multi', 'scale', 'date'] as const;
	const sectionTypes: SectionType[] = [
		'header', 'section_header', 'lined_box', 'prompt_lines',
		'scale', 'checkbox_row', 'mood_grid', 'body_figure',
		'venn2', 'venn3', 'timeline', 'connected_boxes',
		'concentric_circles', 'dual_box', 'paired_columns',
		'momentum_meter', 'footer',
	];
	const categories = ['mood', 'reflection', 'goals', 'decision', 'resilience', 'progress'];

	function addBlank() {
		blanks = [...blanks, { id: `blank_${blanks.length + 1}`, prompt: '', type: 'text' }];
	}

	function removeBlank(index: number) {
		blanks = blanks.filter((_, i) => i !== index);
	}

	function addSection(type: SectionType) {
		sectionConfigs = [...sectionConfigs, { type }];
	}

	function removeSection(index: number) {
		sectionConfigs = sectionConfigs.filter((_, i) => i !== index);
	}

	let blankCount = $derived(blanks.length);
</script>

<svelte:head>
	<title>New Template — feelcheck admin</title>
</svelte:head>

<div class="builder">
	<form method="POST" use:enhance>
		<input type="hidden" name="blanks" value={JSON.stringify(blanks)} />
		<input type="hidden" name="sections" value={JSON.stringify(sectionConfigs)} />

		<div class="builder-header">
			<h1>New Template</h1>
			{#if form?.error}
				<span class="error">{form.error}</span>
			{/if}
			<button type="submit" class="btn-save" disabled={!canSave}>Save Draft</button>
		</div>

	<div class="builder-layout">
		<!-- Left: Editor -->
		<div class="editor">
			<!-- Metadata -->
			<section class="editor-section">
				<h2>Template Info</h2>
				<div class="field">
					<label for="title">Title</label>
					<input id="title" type="text" name="title" bind:value={title} placeholder="e.g. Fear-Setting Exercise" />
				</div>
				<div class="field">
					<label for="description">Description</label>
					<textarea id="description" name="description" bind:value={description} rows="2" placeholder="What this worksheet helps with"></textarea>
				</div>
				<div class="field">
					<label for="psychology">Psychology Framework</label>
					<input id="psychology" type="text" name="psychology" bind:value={psychology} placeholder="e.g. Tim Ferriss — Stoic fear inventory" />
				</div>
				<div class="field">
					<label for="category">Category</label>
					<select id="category" name="category" bind:value={category}>
						{#each categories as cat}
							<option value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
						{/each}
					</select>
				</div>
			</section>

			<!-- Blanks -->
			<section class="editor-section">
				<div class="section-header">
					<h2>Blanks ({blankCount})</h2>
					<button class="btn-add" onclick={addBlank}>+ Add Blank</button>
				</div>

				{#each blanks as blank, i}
					<div class="blank-editor">
						<div class="blank-row">
							<select bind:value={blank.type} class="type-select">
								{#each blankTypes as bt}
									<option value={bt}>{bt}</option>
								{/each}
							</select>
							<input type="text" bind:value={blank.id} placeholder="blank_id" class="id-input" />
							<button class="btn-remove" onclick={() => removeBlank(i)}>x</button>
						</div>
						<input type="text" bind:value={blank.prompt} placeholder="Prompt text (e.g. 'Right now I feel ___')" class="prompt-input" />
						{#if blank.type === 'choice' || blank.type === 'multi'}
							<input
								type="text"
								value={blank.options?.join(', ') ?? ''}
								oninput={(e) => { blank.options = (e.target as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean); }}
								placeholder="Options (comma-separated)"
								class="options-input"
							/>
						{/if}
					</div>
				{/each}

				{#if blanks.length === 0}
					<p class="empty-hint">No blanks yet. Add one to start building your MadLibs template.</p>
				{/if}
			</section>

			<!-- Sections -->
			<section class="editor-section">
				<div class="section-header">
					<h2>Layout Sections</h2>
				</div>

				{#each sectionConfigs as section, i}
					<div class="section-editor">
						<span class="section-type">{section.type}</span>
						<button class="btn-remove" onclick={() => removeSection(i)}>x</button>
					</div>
				{/each}

				<div class="section-picker">
					{#each sectionTypes as st}
						<button class="picker-btn" onclick={() => addSection(st)}>+ {st.replace(/_/g, ' ')}</button>
					{/each}
				</div>
			</section>
		</div>

		<!-- Right: Preview -->
		<div class="preview">
			<div class="preview-card">
				<div class="preview-title">{title || 'Untitled Template'}</div>
				<div class="preview-meta">{psychology || 'No framework specified'}</div>
				<hr />
				{#each blanks as blank}
					<div class="preview-field">
						<span class="preview-label">{blank.prompt || 'Unnamed prompt'}</span>
						<span class="preview-type">{blank.type}</span>
					</div>
				{/each}
				{#if blanks.length === 0}
					<p class="preview-empty">Add blanks to see them here</p>
				{/if}
			</div>
		</div>
	</div>
	</form>
</div>

<style>
	.error {
		color: #c53030;
		font-size: 0.8125rem;
	}

	.builder {
		max-width: 1100px;
	}

	.builder-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-lg);
	}

	h1 {
		font-size: 1.5rem;
	}

	.btn-save {
		padding: var(--space-xs) var(--space-lg);
		background: var(--color-text);
		color: var(--color-white);
		border-radius: var(--corner-r);
		font-weight: 600;
		font-size: 0.875rem;
	}

	.btn-save:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.builder-layout {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: var(--space-lg);
		align-items: start;
	}

	.editor-section {
		background: var(--color-white);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		padding: var(--space-lg);
		margin-bottom: var(--space-md);
	}

	.editor-section h2 {
		font-size: 1rem;
		margin-bottom: var(--space-md);
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.section-header h2 {
		margin-bottom: 0;
	}

	.field {
		margin-bottom: var(--space-sm);
	}

	.field label {
		display: block;
		font-size: 0.75rem;
		color: var(--color-caption);
		margin-bottom: 3px;
	}

	.field input,
	.field textarea,
	.field select {
		width: 100%;
		padding: var(--space-xs) var(--space-sm);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 0.875rem;
	}

	.field input:focus,
	.field textarea:focus,
	.field select:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	.btn-add {
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-bg-fill);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 0.75rem;
		color: var(--color-text);
	}

	.blank-editor {
		padding: var(--space-sm);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		margin-top: var(--space-sm);
	}

	.blank-row {
		display: flex;
		gap: var(--space-xs);
		margin-bottom: var(--space-xs);
	}

	.type-select {
		width: 100px;
		padding: 4px 8px;
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 0.75rem;
		color: var(--color-accent);
	}

	.id-input {
		flex: 1;
		padding: 4px 8px;
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 0.75rem;
		font-family: var(--font-mono);
	}

	.prompt-input,
	.options-input {
		width: 100%;
		padding: 4px 8px;
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 0.8125rem;
		margin-top: var(--space-xs);
	}

	.btn-remove {
		width: 24px;
		height: 24px;
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 0.75rem;
		color: var(--color-caption);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-remove:hover {
		border-color: #c53030;
		color: #c53030;
	}

	.section-editor {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-xs) var(--space-sm);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		margin-top: var(--space-xs);
	}

	.section-type {
		font-size: 0.8125rem;
		font-family: var(--font-mono);
		color: var(--color-accent);
	}

	.section-picker {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-top: var(--space-md);
	}

	.picker-btn {
		padding: 4px 10px;
		background: var(--color-bg-fill);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 0.6875rem;
		color: var(--color-text);
	}

	.picker-btn:hover {
		border-color: var(--color-accent);
	}

	.empty-hint {
		color: var(--color-caption);
		font-size: 0.8125rem;
		text-align: center;
		padding: var(--space-lg);
	}

	/* Preview */
	.preview {
		position: sticky;
		top: var(--space-lg);
	}

	.preview-card {
		background: var(--color-white);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		padding: var(--space-lg);
	}

	.preview-title {
		font-weight: 700;
		font-size: 1rem;
		text-align: center;
	}

	.preview-meta {
		font-size: 0.6875rem;
		color: var(--color-caption);
		text-align: center;
		margin-bottom: var(--space-sm);
	}

	hr {
		border: none;
		border-top: 1px solid var(--color-grid);
		margin: var(--space-sm) 0;
	}

	.preview-field {
		display: flex;
		justify-content: space-between;
		padding: var(--space-xs) 0;
		border-bottom: 1px solid var(--color-bg-fill);
		font-size: 0.8125rem;
	}

	.preview-label {
		color: var(--color-text);
	}

	.preview-type {
		color: var(--color-accent);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
	}

	.preview-empty {
		color: var(--color-caption);
		font-size: 0.8125rem;
		text-align: center;
		padding: var(--space-md);
	}
</style>
