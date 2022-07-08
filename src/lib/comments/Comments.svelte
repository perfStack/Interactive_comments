<script lang="ts">
  import { setContext } from 'svelte';

  import { LOCAL_STORAGE_KEY } from '$lib/scripts/config/LocalStorageKeys';
  import { setDataToLocalStorage } from '../scripts/LocalStorage';
  import NewComment from './cards/card/components/NewComment.svelte';
  import CommentsRender from './cards/CommentsRender.svelte';
  import {
    findComment,
    generateNewComment,
    removeCommentConstructively,
  } from './scripts/CommentsHelper';
  import { commentsDataContextKey, currentUserContextKey } from './scripts/context/CommentsContext';
  import { commentsStore, currentUserStore } from './scripts/data/data-store';

  let commentsData = $commentsStore;
  const currentUserData = $currentUserStore;

  setContext(currentUserContextKey, currentUserData);
  setContext(commentsDataContextKey, commentsData);

  /**
   * Function to handle the reply comment event
   * @param event
   */
  function replyCmntHandler(event: CustomEvent) {
    const { msgPosition, msgContent } = event.detail;

    const commentParent = findComment(commentsData, msgPosition);
    if (!commentParent) throw new Error('Comment parent not found');

    // Generate new comment and make svelte update the component DOM
    commentParent.replies.push(generateNewComment(commentParent, currentUserData, msgContent));
    commentsData = commentsData;

    setDataToLocalStorage(LOCAL_STORAGE_KEY.commentsData, JSON.stringify(commentsData));
  }

  /**
   * Function to handle the edit comment event
   * @param event
   */
  function editCmntHandler(event: CustomEvent) {
    const msg = findComment(commentsData, event.detail.msgPosition);
    msg.content = event.detail.content;

    setDataToLocalStorage(LOCAL_STORAGE_KEY.commentsData, JSON.stringify(commentsData));
  }

  /**
   * Function to handle delete comment event
   * @param event
   */
  function deleteCmntHandler(event: CustomEvent) {
    removeCommentConstructively(commentsData, event.detail.msgPosition);
    commentsData = commentsData;

    setDataToLocalStorage(LOCAL_STORAGE_KEY.commentsData, JSON.stringify(commentsData));
  }

  /**
   * Function to handle the scores of the comment changing
   */
  function modifyScoreHandler() {
    commentsData = commentsData;
    setDataToLocalStorage(LOCAL_STORAGE_KEY.commentsData, JSON.stringify(commentsData));
  }
</script>

<CommentsRender
  commentsData="{commentsData}"
  on:editCommentEvent="{editCmntHandler}"
  on:deleteCommentEvent="{deleteCmntHandler}"
  on:replyEvent="{replyCmntHandler}"
  on:modifyCommentScore="{modifyScoreHandler}"
/>
<NewComment btnContent="send" autoFocusable="{false}" disableWarningText="{true}" />
