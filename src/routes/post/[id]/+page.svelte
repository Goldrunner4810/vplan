<script lang='ts'>
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

{#if data.events.length === 0}
	<p>No events found.</p>
{:else}
	<ul>
		{#each data.events as event}
			<li>
				<h3>{event.title}</h3>
				<p>{event.content}</p>
				<small>{new Date(event.created_at).toLocaleString()}</small>
			</li>
		{/each}
	</ul>
{/if}
