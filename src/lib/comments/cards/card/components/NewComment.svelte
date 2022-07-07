<script lang="ts">
  import type { UserType } from '../../../../data/data-store_types';
  import { createEventDispatcher, getContext } from 'svelte';

  import AvatarImg from './AvatarImg.svelte';
  import CustomButton from './CustomButton.svelte';
  import { currentUserContextKey } from '../../../scripts/Comments-context';

  export let btnContent: string;
  export let textAreaRows = 5;
  export let textAreaCols = 66;
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
    svelteDispatcher('replyEvent', messageContent);
  }
</script>

<div class="new-cc">
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
      <textarea
        class="new-cc__textarea"
        name="new-content"
        id="new-content"
        cols="{textAreaCols}"
        rows="{textAreaRows}"
        spellcheck="true"
        autofocus="{autoFocusable}"
        bind:value="{messageContent}"></textarea>
    </div>
    <div class="new-cc__btn-cont">
      <CustomButton
        btnContent="{btnContent}"
        isDisabled="{isContentInvalid}"
        on:click="{replyEventHandler}"
      />
    </div>
  </div>
  {#if !disableWarningText && isContentInvalid}
    <p class="text-error">Please enter some text to post</p>
  {/if}
</div>

<style lang="scss">
  $padding-box: 1.5rem;

  .new-cc {
    background-color: var(--clr-nutrl-pureWhite);
    border-radius: var(--brdr-radius);
    margin-bottom: 1rem;

    &-cont {
      align-items: flex-start;
      display: flex;
      justify-content: space-between;
      margin-top: 3rem;
      padding: $padding-box;
    }

    &__input-cont {
      display: flex;
      flex-direction: column;
    }

    &__textarea {
      border: 1px solid var(--clr-nutrl-grayBlue);
      border-radius: 4px;
      resize: none;
    }
  }

  .text-error {
    color: var(--clr-pri-softRed);
    margin-top: ($padding-box - 0.5rem) * -1;
    padding-left: 1.5rem;
  }
</style>
