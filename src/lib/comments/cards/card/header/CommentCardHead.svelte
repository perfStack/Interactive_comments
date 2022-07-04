<script lang="ts">
  import type { BaseCommentType, ReplyCommentType } from '../../../../data/data-store_types';
  import { createEventDispatcher, getContext } from 'svelte';
  import { thisPostDataContextKey } from '../../../Scripts/Comments-context';
  import AvatarImg from '../components/AvatarImg.svelte';
  import { currentUserStore } from '../../../../data/data-store';
  import CardIconShake from '../components/CardIconShake.svelte';

  export let contentEditable: boolean;

  const commentData: ReplyCommentType | BaseCommentType = getContext(thisPostDataContextKey);
  const username = commentData.user.username;
  const userImgPath = commentData.user.image;
  const timestamp = commentData.createdAt;

  const isCurrentUserPost = $currentUserStore.username === username;
  const svelteDispatchEvent = createEventDispatcher();

  /**
   * @description - This function is used to handle the edit button click event.
   */
  function editBtnHandler() {
    svelteDispatchEvent('editComment');
  }

  /**
   * @description - This function is triggered when the reply btn is clicked on the comment.
   * Shows the reply comment card for the user to input the reply message
   */
  function replyHandler() {
    svelteDispatchEvent('replyToComment');
  }

  /**
   * @description - This function is used to delete the post,
   */
  function deleteBtnHandler() {
    svelteDispatchEvent('deleteComment');
  }
</script>

<div class="cont">
  <div class="pic-cont">
    <AvatarImg userImgPath="{userImgPath}" username="{username}" />
  </div>
  <div class="head-cont">
    <div class="status-cont">
      <p class="username">{username}</p>
      <!-- Check if the user is logged in,if so then show "You" beside the post author name-->
      {#if isCurrentUserPost}
        <p class="user-status hidden">you</p>
      {/if}
      <p class="timestamp">{timestamp}</p>
    </div>

    <!-- Check if the user is logged in,if so then show edit and delete button on their own posts-->
    {#if isCurrentUserPost}
      <div class="modify-cont">
        <CardIconShake
          imgSrc="/img/icons/icon-delete.svg"
          descriptionText="Delete"
          isDisabled="{contentEditable}"
          isDelete="{true}"
          on:click="{deleteBtnHandler}"
        />
        <CardIconShake
          imgSrc="/img/icons/icon-edit.svg"
          descriptionText="edit"
          isDisabled="{contentEditable}"
          on:click="{editBtnHandler}"
        />
      </div>
    {:else}
      <div class="reply-cont" on:click="{replyHandler}">
        <CardIconShake imgSrc="/img/icons/icon-reply.svg" descriptionText="reply" />
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  $header-font: 1.45rem;

  .cont {
    align-items: center;
    display: flex;
    font-size: $header-font;
    margin-bottom: 2rem;
  }

  .pic-cont {
    margin-right: 12px;
  }

  .head-cont {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .status-cont {
    align-items: flex-start;
    display: flex;
  }

  .username {
    font-weight: 500;
  }

  .user-status {
    background-color: var(--clr-pri-moderateBlue);
    border-radius: 3px;
    color: var(--clr-nutrl-pureWhite);
    font-weight: 500;
    line-height: 1;
    margin-left: 0.6rem;
    margin-top: 0.2rem;
    padding: 0 0.4rem 0.2rem;
  }

  .timestamp {
    color: var(--clr-nutrl-grayBlue);
    font-weight: 500;
    margin-left: 1.2rem;
  }

  .reply-cont {
    display: flex;
  }

  .modify-cont {
    display: flex;
  }

  /*  font-size for all the children of card head */
  :global(.head-cont *) {
    font-size: inherit;
  }

  :global(.modify-cont > :not(:last-child)) {
    margin-right: 1.25rem;
  }
</style>
