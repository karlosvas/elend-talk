<script lang="ts">
  import { Alert } from 'flowbite-svelte';
  import { APP_STATUS, appStatus, errorMessage } from '@/utils/store';
  import StepUpload from './StepUpload.svelte';
  import StepLoading from './StepLoading.svelte';
  import StepChat from './StepChat.svelte';
</script>

<!-- Store de estado de la aplicación en svelte -->
<!-- Documentacion: https://svelte.dev/docs/svelte/stores -->
{#if $appStatus === APP_STATUS.INIT}
  <StepUpload />
{:else if $appStatus === APP_STATUS.LOADING}
  <StepLoading />
{:else if $appStatus === APP_STATUS.ERROR}
  <Alert>
    <p>Error occurred, impossible to load</p>
    <p>{$errorMessage}</p>
  </Alert>
{:else if $appStatus === APP_STATUS.CHAT_MODE}
  <StepChat />
{:else}
 <Alert>
    <p>Unknown status</p>
 </Alert>
{/if}