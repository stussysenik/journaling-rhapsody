<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/state';

	let { children } = $props();
	let isAdmin = $derived(page.url.pathname.startsWith('/admin'));
	let isLanding = $derived(page.url.pathname === '/');
</script>

{#if !isAdmin && !isLanding}
	<Nav />
{/if}

{@render children()}

{#if !isAdmin}
	<Footer />
{/if}
