<script>
  import { Alert } from 'flowbite-svelte';
  import { APP_STATUS, appStatus } from '../utils/store';
  import StepUpload from './StepUpload.svelte';
  import StepLoading from './StepLoading.svelte';
  import StepChat from './StepChat.svelte';
</script>

{#if $appStatus === APP_STATUS.INIT}
  <StepUpload />
{:else if $appStatus === APP_STATUS.LOADING}
  <StepLoading />
{:else if $appStatus === APP_STATUS.ERROR}
  <Alert>
    <p>Error ocurred, imposibol to load</p>
  </Alert>
{:else if $appStatus === APP_STATUS.CHAT_MODE}
  <StepChat />
{:else}
 <Alert>
    <p>Unknown status</p>
 </Alert>
{/if}
<StepChat />