<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<h1>New post</h1>

{#if form?.message}
	<p>{form.message}</p>
{/if}

<form method="post" action="?/create" use:enhance>
	<label>
		Title
		<input name="title" required />
	</label>

	<label>
		Description
		<textarea name="content" required></textarea>
	</label>

	<label>
		Date
		<input name="zeit" type="datetime-local" />
	</label>

	<button>Create post</button>
</form>
