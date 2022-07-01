<script lang='ts'>
  import type { BaseCommentType, ReplyCommentType } from '$lib/data/data-store_types';

  import { createEventDispatcher, getContext } from 'svelte';
  import { thisPostDataContextKey } from '../comments/Scripts/Comments-contenxt';
  import { messageIdGenerator } from '$lib/data/RandomGenerator';
  import { commentsStore } from '../data/data-store';
  import { incrementCommentsHelper } from '../comments/Scripts/Increment';

  const commentsData: BaseCommentType | ReplyCommentType = getContext(thisPostDataContextKey);
  const svelteDispatcher = createEventDispatcher();

  /**
   * @description This is used to increment the count by 1.
   */
  function increment() {
    // Increment the score by 1.
    commentsData.score = commentsData.score + 1;
    incrementCommentsHelper($commentsStore, commentsData);
    // Change the message id to indicate that the score has been incremented.
    messageIdGenerator.updateId(commentsData);
    // Dispatch the event further up the chain so DOM can be updated.
    svelteDispatcher('incrementCounter');
  }
</script>

<button class='counter-btn' on:click={increment}>
  <svg class='counter-btn__svg' viewBox='0 0 11 11' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z'
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
