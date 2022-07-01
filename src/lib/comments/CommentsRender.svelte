<script lang='ts'>
  import type { BaseCommentType, UserType } from '$lib/data/data-store_types';

  import CommentsCard from '$lib/comments/CommentsCard.svelte';

  export let commentsData: BaseCommentType[];
  export let isChild = false;
  export let currentUserData: UserType;
</script>

{#each commentsData as comment (comment.id)}
  <CommentsCard
    commentData={comment}
    {isChild}
    isCurrentUserPost={currentUserData.username === comment.user.username}
    {currentUserData}
    on:editCommentEvent
    on:deleteCommentEvent
    on:replyEvent
    on:incrementCounter
    on:decrementCounter
  >
    <!-- Check if it has replies array if it has, then check if it has atleast 1 reply -->
    <!-- Issue with named slots https://github.com/sveltejs/svelte/issues/5312 -->
    {#if comment.replies && comment.replies.length > 0}
      <div class='reply-cont'>
        <svelte:self
          commentsData={comment.replies}
          isChild={true}
          {currentUserData}
          on:editCommentEvent
          on:deleteCommentEvent
          on:replyEvent
          on:incrementCounter
          on:decrementCounter
        />
      </div>
    {/if}

    <!-- <svelte:fragment slot="cc__new-reply-cont">
      {#if comment.replies && comment.replies.length > 0}
        <svelte:self commentsData={comment.replies} isChild={true} {currentUserData} on:click />
      {/if}
    </svelte:fragment> -->
  </CommentsCard>
{/each}

<style lang='scss'>
  .reply-cont {
    border-left: 2px solid var(--clr-nutrl-lightGray);
    margin-left: 30px;
    margin-top: 10px;
    padding-left: 30px;

    /*
    &:empty {
      display: none;display
    }

    &:-moz-only-whitespace {
      display: none;display
    }
    */
  }
</style>
