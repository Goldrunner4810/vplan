<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>
<form
    method="post"
    action="?/create"
    use:enhance>
    <input name="name" />
    <input name="description">
    <button>submit</button>
    
</form>
