<script lang='ts'>
  import type { BaseCommentType, ReplyCommentType } from '$lib/data/data-store_types';

  import { createEventDispatcher, getContext } from 'svelte';
  import { thisPostDataContextKey } from '$lib/comments/Comments-contenxt';
  import { messageIdGenerator } from '$lib/data/RandomGenerator';

  const commentsData: BaseCommentType | ReplyCommentType = getContext(thisPostDataContextKey);
  const svelteDispatcher = createEventDispatcher();

  /**
   * @description This is used to decrement the count by 1.
   */
  function decrement() {
    // decrement the count by 1
    commentsData.score = commentsData.score - 1;
    // Change te id of the message so svelte knows to update the component.
    messageIdGenerator.updateId(commentsData);
    // Dispatch the event further up the chain, so that the component can update.
    svelteDispatcher('decrementCounter');
  }
</script>

<button class='counter-btn' on:click={decrement}>
  <svg class='counter-btn__svg' viewBox='0 0 11 3' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z'
      fill='#C5C6EF' />
  </svg>
</button>

<style lang='scss'>
  .counter-btn {
    align-items: center;
    display: flex;
    justify-content: center;

    &__svg {
      cursor: pointer;
      height: 100%;
      width: 100%;

      > path {
        fill: hsl(239deg 57% 85%);
      }

      &:hover > path {
        fill: hsl(239deg 67% 71%);
      }
    }
  }
</style>
