<script lang="ts">
	import type { Blank } from '$lib/schema/types.js';

	let { blank, value = $bindable(''), onchange }: {
		blank: Blank;
		value: string;
		onchange?: (value: string) => void;
	} = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement;
		value = target.value;
		onchange?.(value);
	}

	function handleChoice(option: string) {
		value = option;
		onchange?.(option);
	}
</script>

<div class="blank-input">
	<label class="prompt">{blank.prompt}</label>

	{#if blank.type === 'text'}
		<input
			type="text"
			{value}
			placeholder={blank.placeholder ?? ''}
			oninput={handleInput}
		/>

	{:else if blank.type === 'textarea'}
		<textarea
			{value}
			placeholder={blank.placeholder ?? ''}
			rows="3"
			oninput={handleInput}
		></textarea>

	{:else if blank.type === 'choice' && blank.options}
		<div class="pills">
			{#each blank.options as option}
				<button
					class="pill"
					class:selected={value === option}
					onclick={() => handleChoice(option)}
				>
					{option}
				</button>
			{/each}
		</div>

	{:else if blank.type === 'multi' && blank.options}
		<div class="pills">
			{#each blank.options as option}
				{@const selected = value.split(',').includes(option)}
				<button
					class="pill"
					class:selected
					onclick={() => {
						const current = value ? value.split(',') : [];
						if (selected) {
							value = current.filter(v => v !== option).join(',');
						} else {
							value = [...current, option].join(',');
						}
						onchange?.(value);
					}}
				>
					{option}
				</button>
			{/each}
		</div>

	{:else if blank.type === 'scale'}
		<div class="scale">
			<span class="scale-label">{blank.lowLabel ?? blank.min ?? 1}</span>
			<input
				type="range"
				min={blank.min ?? 1}
				max={blank.max ?? 10}
				value={value || String(blank.min ?? 1)}
				oninput={handleInput}
			/>
			<span class="scale-label">{blank.highLabel ?? blank.max ?? 10}</span>
			<span class="scale-value">{value || (blank.min ?? 1)}</span>
		</div>

	{:else if blank.type === 'date'}
		<input
			type="date"
			value={value || new Date().toISOString().split('T')[0]}
			oninput={handleInput}
		/>
	{/if}
</div>

<style>
	.blank-input {
		margin-bottom: var(--space-md);
	}

	.prompt {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: var(--space-xs);
	}

	input[type='text'],
	input[type='date'],
	textarea {
		width: 100%;
		padding: var(--space-sm);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 0.9375rem;
		color: var(--color-text);
		background: var(--color-white);
		transition: border-color 0.15s;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	.pill {
		padding: var(--space-xs) var(--space-md);
		border: 1px solid var(--color-grid);
		border-radius: 999px;
		font-size: 0.8125rem;
		color: var(--color-caption);
		background: var(--color-white);
		transition: all 0.15s;
	}

	.pill:hover {
		border-color: var(--color-accent);
		color: var(--color-text);
	}

	.pill.selected {
		background: var(--color-text);
		color: var(--color-white);
		border-color: var(--color-text);
	}

	.scale {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.scale input[type='range'] {
		flex: 1;
		accent-color: var(--color-accent);
	}

	.scale-label {
		font-size: 0.75rem;
		color: var(--color-caption);
		min-width: 60px;
	}

	.scale-label:last-of-type {
		text-align: right;
	}

	.scale-value {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-accent);
		min-width: 30px;
		text-align: center;
	}
</style>
