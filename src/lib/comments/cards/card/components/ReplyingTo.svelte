<script lang="ts">
  import type { BaseCommentType, ReplyCommentType } from '../../../scripts/data/data-store_types';
  import { getContext } from 'svelte';
  import { thisPostDataContextKey } from '../../../scripts/context/CommentsContext';

  const commentData: ReplyCommentType | BaseCommentType = getContext(thisPostDataContextKey);
  const replyingTo = 'replyingTo' in commentData ? commentData.replyingTo : null;
</script>

{#if replyingTo}
  <p class="replying-to-cont">
    Replying to <span class="replying-to">@{replyingTo}</span>
  </p>
{/if}

<style lang="scss">
  .replying-to-cont {
    color: var(--clr-nutrl-grayBlue);
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }

  .replying-to {
    color: var(--clr-pri-moderateBlue);
    cursor: default;
    font-weight: 600;
  }
</style>
