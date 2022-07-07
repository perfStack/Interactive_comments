<script lang="ts">
  import type { BaseCommentType, ReplyCommentType } from '../../../scripts/data-store_types';
  import { createEventDispatcher, getContext } from 'svelte';

  import Incrementer from './Incrementer.svelte';
  import Decrementer from './Decrementer.svelte';
  import {
    commentsDataContextKey,
    thisPostDataContextKey,
  } from '../../../scripts/Comments-context';
  import { incrementCommentHelper } from './scripts/Increment';
  import { decrementCommentHelper } from './scripts/Decrement';

  const commentData: ReplyCommentType | BaseCommentType = getContext(thisPostDataContextKey);
  const globalCommentsData: BaseCommentType[] = getContext(commentsDataContextKey);
  const svelteDispatcher = createEventDispatcher();
  const dispatcherKey = 'modifyCommentScore';

  /**
   * @description This is used to increment the count by 1.
   */
  function increment() {
    // Increment the score by 1.
    commentData.score = commentData.score + 1;
    incrementCommentHelper(globalCommentsData, commentData);
    // Change the message id to indicate that the score has been incremented.
    // messageIdGenerator.updateId(commentData);
    // Dispatch the event further up the chain so DOM can be updated.
    svelteDispatcher(dispatcherKey);
  }

  /**
   * @description This is used to decrement the count by 1.
   */
  function decrement() {
    // Decrement the score by 1.
    commentData.score = commentData.score - 1;
    decrementCommentHelper(globalCommentsData, commentData);
    // Change the message id to indicate that the score has been incremented.
    // messageIdGenerator.updateId(commentData);
    // Dispatch the event further up the chain so DOM can be updated.
    svelteDispatcher(dispatcherKey);
  }
</script>

<div class="counter">
  <div class="counter__icon-cont counter__icon-cont--1" on:click="{increment}">
    <button class="counter__btn">
      <Incrementer />
    </button>
  </div>
  <div class="score">
    <p>{commentData.score}</p>
  </div>
  <div class="counter__icon-cont counter__icon-cont--2">
    <button class="counter__btn" on:click="{decrement}">
      <Decrementer />
    </button>
  </div>
</div>

<style lang="scss">
  /* Counter */
  .counter {
    align-items: center;
    background-color: var(--clr-nutrl-vlightGray);
    border-radius: var(--brdr-radius);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 7.5rem;
    min-width: 3.5rem;
    padding: 0.8rem 0.6rem;

    &__btn {
      align-items: center;
      display: flex;
      height: inherit;
      justify-content: center;
      padding: 0.6rem;
      width: inherit;
    }

    &__icon-cont {
      align-items: center;
      display: flex;
      height: 2.5rem;
      justify-content: center;
      width: 2.5rem;

      &--1 {
        margin-bottom: 0.15rem;
      }
    }

    .score > p {
      color: var(--clr-pri-moderateBlue);
      font-size: 1.6rem;
      font-weight: 500;
      margin-top: 4px;
    }
  }
</style>
