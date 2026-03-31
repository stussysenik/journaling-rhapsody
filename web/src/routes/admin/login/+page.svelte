<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<svelte:head>
	<title>Admin Login — feelcheck</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<h2>feel<span class="accent">check</span> admin</h2>
		<p class="caption">Enter your password to continue</p>

		<form method="POST" use:enhance>
			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}
			<input
				type="password"
				name="password"
				placeholder="Password"
				required
				autocomplete="current-password"
			/>
			<button type="submit">Sign In</button>
		</form>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg);
	}

	.login-card {
		text-align: center;
		padding: var(--space-2xl);
		background: var(--color-white);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		width: 360px;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: var(--space-xs);
	}

	.accent {
		color: var(--color-accent);
	}

	.caption {
		color: var(--color-caption);
		font-size: 0.875rem;
		margin-bottom: var(--space-lg);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	input {
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-grid);
		border-radius: var(--corner-r);
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: var(--color-accent);
	}

	button {
		padding: var(--space-sm) var(--space-md);
		background: var(--color-text);
		color: var(--color-white);
		border-radius: var(--corner-r);
		font-weight: 600;
		font-size: 1rem;
	}

	button:hover {
		opacity: 0.85;
	}

	.error {
		color: #c53030;
		font-size: 0.875rem;
		padding: var(--space-xs) var(--space-sm);
		background: #fff5f5;
		border: 1px solid #feb2b2;
		border-radius: var(--corner-r);
	}
</style>
