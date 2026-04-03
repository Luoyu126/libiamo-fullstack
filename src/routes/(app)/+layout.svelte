<script lang="ts">
import Navbar from "$lib/components/Navbar.svelte";

let { children, data } = $props();
</script>

<div class="min-h-screen">
	<Navbar mode="app" user={data.user} avatarUrl={data.avatarUrl} />
	<main class="mx-auto max-w-5xl px-4 py-8 pt-24">{@render children()}</main>
</div>
