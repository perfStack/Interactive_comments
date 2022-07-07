<script lang="ts">
  import type { BaseCommentType, ReplyCommentType } from '../../../data/data-store_types';

  import { createEventDispatcher, setContext } from 'svelte';
  import NewComment from './components/NewComment.svelte';
  import { moveCursorToTheEnd } from '../../scripts/CommentsHelper';
  import CustomButton from './components/CustomButton.svelte';
  import Counter from './counter/Counter.svelte';
  import { thisPostDataContextKey, thisTimerInstance } from '../../scripts/Comments-context';
  import CommentCardHead from './header/CommentCardHead.svelte';
  import ReplyingTo from './components/ReplyingTo.svelte';
  import { Timer } from './header/scripts/timer';

  export let commentData: BaseCommentType | ReplyCommentType;
  export let isChild = false;

  const postPosition = commentData.position;
  const messageContent = commentData.content;

  let showReply = false;
  let contentEditable = false;
  let contentValue: HTMLElement;
  let contentLengthValid = true;
  // todo fix the above
  // todo make replying-to smooth scroll to the user

  const timerFunc = new Timer(commentData.createdAtDate);
  setContext(thisTimerInstance, timerFunc);
  setContext(thisPostDataContextKey, commentData);

  const dispatchEvent = createEventDispatcher();

  /**
   * @description - This function is used to handle the edit button click event.
   */
  function editBtnHandler() {
    // If the content is editable, then we need to set the content to the commentData
    contentEditable = true;
    // Use setTimeout to make sure that the cursor has time to position itself
    setTimeout(() => {
      contentValue.focus();
      moveCursorToTheEnd(contentValue);
    }, 0);
  }

  /**
   * @description - This function is used to monitor the content,
   *  when the user clicks on the edit button
   */
  function monitorTextModification(e: Event) {
    try {
      const target = e.target as HTMLElement;
      const childTextContent = target.textContent;

      // if (!replyingTo) throw new Error("Can't find replyingTo val");

      if (childTextContent) {
        contentLengthValid = childTextContent.trim().length > 0;
      } else {
        contentLengthValid = false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @description - This function is used to save the content,
   */
  function modifyContentHandler() {
    contentEditable = false;
    // presentation part is over so send the required data further up the chain
    // by dispatching a custom event and passing the data of messageId and content.
    dispatchEvent('editCommentEvent', {
      msgPosition: postPosition,
      content: contentValue.innerText.trim(),
    });
  }

  /**
   * @description - This function is used to delete the post,
   */
  function deleteBtnHandler() {
    dispatchEvent('deleteCommentEvent', {
      msgPosition: postPosition,
    });
  }

  /**
   * @description - This function is triggered when the reply btn is clicked on the comment.
   * Shows the reply comment card for the user to input the reply message
   */
  function replyHandler() {
    showReply = !showReply;
  }

  /**
   * @description - This function is fired when the user enters text and then clicks the reply button.
   * hides the reply card and then dispatches a new event with the reply message.
   */
  function replyEventHandler(event: CustomEvent) {
    showReply = false;
    dispatchEvent('replyEvent', { msgPosition: postPosition, msgContent: event.detail });
  }
</script>

<!-- cc = commentCard -->
<div class="cc" class:child="{isChild}" data-msg-pos-id="{postPosition}" on:click>
  <div class="cc-cont">
    <div class="cc__cont__1">
      <Counter on:modifyCommentScore />
    </div>
    <div class="cc__content">
      <CommentCardHead
        contentEditable="{contentEditable}"
        on:editComment="{editBtnHandler}"
        on:replyToComment="{replyHandler}"
        on:deleteComment="{deleteBtnHandler}"
      />
      <div class="cc__content__body">
        <ReplyingTo />
        <div
          class="cc__content-text-cont"
          contenteditable="{contentEditable}"
          on:input="{monitorTextModification}"
          spellcheck="true"
        >
          <p bind:this="{contentValue}" class="cc__content-text">
            {messageContent}
          </p>
        </div>

        {#if !contentLengthValid}
          <p class="cc__content-text-error">Please enter some text to post</p>
        {/if}
        <!-- Show an Update btn if the content element is content editable which
        means the user is  trying to edit an existing post -->
        {#if contentEditable}
          <div class="cc__content-update">
            <CustomButton
              btnContent="update"
              isDisabled="{!contentLengthValid}"
              on:click="{modifyContentHandler}"
            />
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Show the reply box -->
  {#if showReply}
    <NewComment btnContent="reply" on:replyEvent="{replyEventHandler}" />
  {/if}

  <slot />

  <!-- <div class="cc__new-reply-cont">
    <slot name="cc__new-reply-cont" />
  </div> -->
</div>

<style lang="scss">
  $card-width: 60rem;

  .cc {
    width: var(--comments-cont-width);

    &-cont {
      align-items: flex-start;
      background-color: var(--clr-nutrl-pureWhite);
      border-radius: var(--brdr-radius);
      display: flex;
      padding: 2rem;
    }

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &__cont__1 {
      margin-right: 2rem;
    }

    /* Content */
    &__content {
      width: 100%;
    }

    &__content-text-cont[contenteditable='true'] {
      border: 1px solid var(--clr-pri-moderateBlue);
      border-radius: var(--brdr-radius);
      outline: none;
      padding: 1rem 1.5rem;
    }

    &__content-text-error {
      color: var(--clr-pri-harshRed);
    }

    &__content-update {
      align-items: center;
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
  }

  .cc.child {
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
</style>
