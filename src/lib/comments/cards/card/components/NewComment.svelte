<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { UserType } from '../../../scripts/data/data-store_types';

  import { currentUserContextKey } from '../../../scripts/context/CommentsContext';
  import AvatarImg from './AvatarImg.svelte';
  import CustomButton from './CustomButton.svelte';

  export let btnContent: string;
  export let autoFocusable = true;
  export let disableWarningText = false;

  const userData: UserType = getContext(currentUserContextKey);
  let messageContent = '';
  const username = userData.username;
  const userImgPath = userData.image;
  let isContentInvalid: boolean;
  $: isContentInvalid = messageContent.length < 1;

  const svelteDispatcher = createEventDispatcher();

  /**
   * Function to handle the reply event on an existing message.
   */
  function replyEventHandler() {
    svelteDispatcher('postEvent', messageContent);
    // Clear textarea content on submit event.
    messageContent = '';
  }
</script>

<div class="new-cc" transition:slide>
  <div class="new-cc-cont">
    <div class="new-cc__avatar-cont">
      <AvatarImg
        username="{username}"
        userImgPath="{userImgPath}"
        imgHeight="{40}"
        imgWidth="{40}"
      />
    </div>
    <div class="new-cc__input-cont">
      <!-- svelte-ignore a11y-autofocus -->
      <textarea
        class="new-cc__textarea"
        name="new-content"
        id="new-content"
        spellcheck="true"
        autofocus="{autoFocusable}"
        aria-label="new comment textarea"
        bind:value="{messageContent}"></textarea>
      {#if !disableWarningText && isContentInvalid}
        <p class="text-error">Please enter some text to post</p>
      {/if}
    </div>
    <div class="new-cc__btn-cont">
      <CustomButton
        btnContent="{btnContent}"
        isDisabled="{isContentInvalid}"
        on:click="{replyEventHandler}"
      />
    </div>
  </div>
</div>

<style lang="scss">
  $padding-box: 1.5rem;

  .new-cc {
    background-color: var(--clr-nutrl-pureWhite);
    border-radius: var(--brdr-radius);
    box-shadow: 0 1px 2px 2px hsl(0deg 0% 92%);

    &-cont {
      align-items: flex-start;
      display: flex;
      justify-content: space-between;
      padding: $padding-box $padding-box ($padding-box - 0.5rem);
    }

    &__input-cont {
      display: flex;
      flex-direction: column;
      height: 9rem;
      width: 70%;
    }

    &__textarea {
      border: 1px solid var(--clr-nutrl-grayBlue);
      border-radius: 4px;
      color: var(--clr-nutrl-darkBlue);
      font-family: Rubik, sans-serif;
      font-size: 1.6rem;
      height: 100%;
      padding: 0.3rem 0.6rem;
      resize: none;
      width: 100%;
    }
  }

  .text-error {
    color: var(--clr-pri-softRed);
    margin-top: 0.1rem;
  }
</style>
