<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Timer } from './scripts/timer';

  export let timerFunction: Timer;

  const fullTimeStamp = new Date(timerFunction.createdAtDateOfMsg).toUTCString();
  let showFullTimeStamp = false;

  let timestamp: string;
  const unsubscribe = timerFunction.timerValueStore.subscribe((value) => {
    timestamp = value;
  });

  onDestroy(unsubscribe);
</script>

<div
  class="timestamp-cont"
  on:mouseenter="{() => (showFullTimeStamp = true)}"
  on:mouseleave="{() => (showFullTimeStamp = false)}"
>
  <p class="timestamp-display">{timestamp} ago</p>
  <div class="timestamp-full" class:visually-hidden="{!showFullTimeStamp}">
    <p>{fullTimeStamp}</p>
  </div>
</div>

<style lang="scss">
  .timestamp {
    &-cont {
      margin-left: 1.2rem;
      position: relative;
    }

    &-display {
      color: var(--clr-nutrl-grayBlue);
      font-weight: 500;
    }

    &-full {
      background-color: var(--clr-nutrl-darkBlue);
      border-radius: var(--brdr-radius);
      left: 0;
      min-width: 24rem;
      padding: 0.2rem 0.8rem;
      position: absolute;
      top: 2.5rem;

      > p {
        color: var(--clr-nutrl-pureWhite);
      }
    }
  }
</style>
