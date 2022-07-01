<script lang='ts'>
  // eslint-disable-next-line max-len
  import type { BaseCommentType, ImgType, ReplyCommentType, UserType } from '$lib/data/data-store_types';

  import { createEventDispatcher, setContext } from 'svelte';
  import CardIconShake from '$lib/components/CardIconShake.svelte';
  import AvatarImg from '$lib/components/AvatarImg.svelte';
  import NewComment from './NewComment.svelte';
  import { moveCursorToTheEnd } from './Scripts/CommentsHelper';
  import CustomButton from '$lib/components/CustomButton.svelte';
  import Incrementer from '$lib/counter/Incrementer.svelte';
  import Decrementer from '$lib/counter/Decrementer.svelte';
  import { thisPostDataContextKey } from './Scripts/Comments-contenxt';


  export let commentData: BaseCommentType | ReplyCommentType;
  export let currentUserData: UserType;
  export let isChild = false;
  export let isCurrentUserPost = false;

  const postPosition = commentData.position;
  const upvoteCounter = commentData.score;
  const username = commentData.user.username;
  const userImgPath: ImgType = {
    png: commentData.user.image.png,
    webp: commentData.user.image.webp,
  };
  const timestamp = commentData.createdAt;
  const messageContent = commentData.content;
  const replyingTo: string | undefined = (commentData as ReplyCommentType)?.replyingTo || undefined;

  let showReply = false;
  let contentEditable = false;
  let contentValue: HTMLElement;
  let contentLengthValid = true;
  // todo fix the above
  // todo make replying-to smooth scroll to the user

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

      if (!replyingTo) throw new Error('Can\'t find replyingTo val');

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
    showReply = true;
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
<div class='cc' class:child={isChild} data-msg-pos-id={postPosition} on:click>
  <div class='cc-cont'>
    <div class='cc__counter'>
      <div class='cc__counter-cont'>
        <div class='cc__counter__icon-cont '>
          <Incrementer on:incrementCounter></Incrementer>
        </div>
        <div class='cc__upvotes'>
          <p>{upvoteCounter}</p>
        </div>
        <div class='cc__counter__icon-cont'>
          <Decrementer on:decrementCounter></Decrementer>
        </div>
      </div>
    </div>
    <div class='cc__content'>
      <div class='cc__content__head'>
        <div class='cc__content__pic-cont'>
          <AvatarImg {userImgPath} {username} />
        </div>
        <div class='cc__head-cont'>
          <div class='cc__status-cont'>
            <p class='cc__username'>{username}</p>
            <!-- Check if the user is logged in,if so then show "You" beside the post author name-->
            {#if isCurrentUserPost}
              <p class='cc__user-status hidden'>you</p>
            {/if}
            <p class='cc__timestamp'>{timestamp}</p>
          </div>

          <!-- Check if the user is logged in,if so then show edit and delete button on their own posts-->
          {#if isCurrentUserPost}
            <div class='cc__modify-cont'>
              <CardIconShake
                imgSrc='/img/icons/icon-delete.svg'
                descriptionText='Delete'
                isDisabled={contentEditable}
                isDelete={true}
                on:click={deleteBtnHandler}
              />
              <CardIconShake
                imgSrc='/img/icons/icon-edit.svg'
                descriptionText='edit'
                isDisabled={contentEditable}
                on:click={editBtnHandler}
              />
            </div>
          {:else}
            <div class='cc__reply-cont' on:click={replyHandler}>
              <CardIconShake
                imgSrc='/img/icons/icon-reply.svg'
                isDisabled={showReply}
                descriptionText='reply'
              />
            </div>
          {/if}
        </div>
      </div>
      <div class='cc__content__body'>
        {#if replyingTo}
          <p class='replying-to-cont'>
            Replying to <span class='replying-to'>@{replyingTo}</span>
          </p>
        {/if}
        <div
          class='cc__content-text-cont'
          contenteditable={contentEditable}
          on:input={monitorTextModification}
          spellcheck='true'
        >
          <p bind:this={contentValue} class='cc__content-text'>
            {messageContent}
          </p>
        </div>

        {#if !contentLengthValid}
          <p class='cc__content-text-error'>Please enter some text to post</p>
        {/if}
        <!-- Show an Update btn if the content element is contenteditable which
        means the user is  trying to edit an existing post -->
        {#if contentEditable}
          <div class='cc__content-update'>
            <CustomButton
              btnContent='update'
              isDisabled={!contentLengthValid}
              on:click={modifyContentHandler}
            />
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Show the reply box -->
  {#if showReply}
    <NewComment {currentUserData} btnContent='reply' on:replyEvent={replyEventHandler} />
  {/if}

  <slot />

  <!-- <div class="cc__new-reply-cont">
    <slot name="cc__new-reply-cont" />
  </div> -->
</div>

<style lang='scss'>
  $header-font: 1.45rem;
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

    /* Counter */
    &__counter {
      margin-right: 2rem;

      &-cont {
        align-items: center;
        background-color: var(--clr-nutrl-vlightGray);
        border-radius: var(--brdr-radius);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 3rem;
        padding: 0.8rem 0.6rem;
      }

      &__icon-cont {
        align-items: center;
        display: flex;
        height: 1rem;
        justify-content: center;
        width: 1rem;
      }
    }

    &__upvotes > p {
      color: var(--clr-pri-moderateBlue);
      font-size: 1.6rem;
      font-weight: 500;
      margin-top: 4px;
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

    &__content-update {
      align-items: center;
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    /* * Content header * */
    &__content__head {
      align-items: center;
      display: flex;
      font-size: $header-font;
      margin-bottom: 2rem;
    }

    &__content__pic-cont {
      margin-right: 12px;
    }

    &__head-cont {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    &__status-cont {
      align-items: flex-start;
      display: flex;
    }

    &__username {
      font-weight: 500;
    }

    &__user-status {
      background-color: var(--clr-pri-moderateBlue);
      border-radius: 3px;
      color: var(--clr-nutrl-pureWhite);
      font-weight: 500;
      line-height: 1;
      margin-left: 0.6rem;
      margin-top: 0.2rem;
      padding: 0 0.4rem 0.2rem;
    }

    &__timestamp {
      color: var(--clr-nutrl-grayBlue);
      font-weight: 500;
      margin-left: 1.2rem;
    }

    &__reply-cont {
      display: flex;
    }

    &__modify-cont {
      display: flex;
    }
  }

  .cc.child {
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }

  /*  font-size for all the children of card head */
  :global(.cc__head-cont *) {
    font-size: inherit;
  }

  :global(.cc__counter__icon-cont > *) {
    height: 100%;
    width: 100%;
  }

  :global(.cc__modify-cont > :not(:last-child)) {
    margin-right: 1rem;
  }
</style>
