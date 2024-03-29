<script lang="ts">
  import type { BaseCommentType, ReplyCommentType } from '../../../scripts/data/data-store_types';
  import type { Timer } from './scripts/timer';

  import { createEventDispatcher, getContext } from 'svelte';
  import {
    thisPostDataContextKey,
    thisTimerInstance,
  } from '../../../scripts/context/CommentsContext';
  import { currentUserStore } from '../../../scripts/data/data-store';
  import AvatarImg from '../components/AvatarImg.svelte';
  import CardIconShake from '../components/CardIconShake.svelte';
  import FullScreenConfirmationModal from '../components/FullScreenConfirmationModal.svelte';
  import Timestamp from './Timestamp.svelte';
  // import icons
  import iconDelete from '$lib/assets/img/icons/icon-delete.svg';
  import iconEdit from '$lib/assets/img/icons/icon-edit.svg';
  import iconReply from '$lib/assets/img/icons/icon-reply.svg';
  // import icons

  export let contentEditable: boolean;

  const commentData: ReplyCommentType | BaseCommentType = getContext(thisPostDataContextKey);
  const username = commentData.user.username;
  const userImgPath = commentData.user.image;
  const deleteConfirmationMessage =
    // eslint-disable-next-line max-len
    'Are you sure you want to delete this comment? This will remove the comment and cannot be undone.';
  let awaitConfirmation = false;

  const timerFunction: Timer = getContext(thisTimerInstance);
  timerFunction.setIntervalTimer();

  // console.log(timestamp);

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
    // svelteDispatchEvent('deleteComment');
    awaitConfirmation = true;
  }

  /**
   *
   */
  function deleteConfirmationHandler() {
    svelteDispatchEvent('deleteComment');
    awaitConfirmation = false;
  }
</script>

{#if awaitConfirmation}
  <FullScreenConfirmationModal
    heading="Delete Comment"
    message="{deleteConfirmationMessage}"
    cancelBtnText="No,Cancel"
    confirmBtnText="Yes,Delete"
    confirmBtnClr="var(--clr-pri-softRed)"
    on:confirmBtn="{deleteConfirmationHandler}"
    on:cancelBtn="{() => (awaitConfirmation = false)}"
  />
{/if}
<div class="cont">
  {#if !commentData.isDeleted}
    <div class="pic-cont">
      <AvatarImg userImgPath="{userImgPath}" username="{username}" />
    </div>
  {/if}
  <div class="head-cont">
    <div class="status-cont">
      <p class="username">{username}</p>
      <!-- Check if the user is logged in,if so then show "You" beside the post author name-->
      {#if isCurrentUserPost}
        <p class="user-status">you</p>
      {/if}
      <!-- <p class="timestamp">{countValue} ago</p> -->
      <Timestamp timerFunction="{timerFunction}" />
    </div>

    <!-- Check if the user is logged in,if so then show edit and delete button on their own posts-->
    {#if isCurrentUserPost && !commentData.isDeleted}
      <div class="modify-cont">
        <CardIconShake
          imgSrc="{iconDelete}"
          descriptionText="Delete"
          isDisabled="{contentEditable}"
          isDelete="{true}"
          on:click="{deleteBtnHandler}"
        />
        <CardIconShake
          imgSrc="{iconEdit}"
          descriptionText="edit"
          isDisabled="{contentEditable}"
          on:click="{editBtnHandler}"
        />
      </div>
    {:else if !commentData.isDeleted}
      <div class="reply-cont" on:click="{replyHandler}">
        <CardIconShake imgSrc="{iconReply}" descriptionText="reply" />
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
