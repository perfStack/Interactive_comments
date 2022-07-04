<script lang="ts">
  import type { BaseCommentType } from '../../data/data-store_types';

  import CommentsCard from './card/CommentsCard.svelte';

  export let commentsData: BaseCommentType[];
  export let isChild = false;
</script>

{#each commentsData as comment (comment.id)}
  <CommentsCard
    commentData="{comment}"
    isChild="{isChild}"
    on:editCommentEvent
    on:deleteCommentEvent
    on:replyEvent
    on:modifyCommentScore
  >
    <!-- Check if it has replies array if it has, then check if it has atleast 1 reply -->
    <!-- Issue with named slots https://github.com/sveltejs/svelte/issues/5312 -->
    {#if comment.replies && comment.replies.length > 0}
      <div class="reply-cont">
        <svelte:self
          commentsData="{comment.replies}"
          isChild="{true}"
          on:editCommentEvent
          on:deleteCommentEvent
          on:replyEvent
          on:modifyCommentScore
        />
      </div>
    {/if}

    <!-- <svelte:fragment slot="cc__new-reply-cont">
      {#if comment.replies && comment.replies.length > 0}
        <svelte:self globalCommentsData={comment.replies} isChild={true} {currentUserData} on:click />
      {/if}
    </svelte:fragment> -->
  </CommentsCard>
{/each}

<style lang="scss">
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
