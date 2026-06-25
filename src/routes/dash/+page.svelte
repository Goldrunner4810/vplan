<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	function formatEventTime(value: unknown) {
		if (value == null) return null;

		const date = value instanceof Date ? value : new Date(String(value));
		if (Number.isNaN(date.getTime())) return null;

		return date.toLocaleString('de-AT', {
			dateStyle: 'medium',
			timeStyle: 'short'
		});
	}
</script>

<h1>Hi, {data.user.name}!</h1>
<p>Your user ID is {data.user.id}.</p>
<form method="post" action="?/signOut" use:enhance>
	<button >Sign out</button>
</form>

<h2>Events</h2>

{#if data.events.length === 0}
	<p>No events found.</p>
{:else}
	<ul>
		{#each data.events as event}
			<li>
				<h3>{event.title}</h3>
				<p>{event.content}</p>
				{#if formatEventTime(event.zeit)}
					<p>
						<time datetime={String(event.zeit)}>{formatEventTime(event.zeit)}</time>
					</p>
				{/if}
				<a href={"/post/" + event.id}>open</a>
			</li>
		{/each}
		<a href= {"/stats"}> Statisik</a>
	</ul>
{/if}
