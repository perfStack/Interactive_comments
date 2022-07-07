<script lang="ts">
  import { setContext } from 'svelte';

  import { commentsStore, currentUserStore } from './scripts/data-store';
  import CommentsRender from './cards/CommentsRender.svelte';
  import NewComment from './cards/card/components/NewComment.svelte';
  import { findComment, generateNewComment, removeComment } from './scripts/CommentsHelper';
  import { LOCAL_STORAGE_KEY } from '$lib/config/LocalStorageKeys';
  import { commentsDataContextKey, currentUserContextKey } from './scripts/Comments-context';
  import { setDataToLocalStorage } from '../data/LocalStorage';

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

    const [commentParent] = findComment(commentsData, msgPosition);
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
    const [msg] = findComment(commentsData, event.detail.msgPosition);
    msg.content = event.detail.content;

    setDataToLocalStorage(LOCAL_STORAGE_KEY.commentsData, JSON.stringify(commentsData));
  }

  /**
   * Function to handle delete comment event
   * @param event
   */
  function deleteCmntHandler(event: CustomEvent) {
    // console.log(event.detail.msgPosition);

    removeComment(commentsData, event.detail.msgPosition);
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
