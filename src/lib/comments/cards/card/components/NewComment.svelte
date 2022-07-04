<script lang="ts">
  import type { UserType } from '../../../../data/data-store_types';

  import { createEventDispatcher } from 'svelte';

  import AvatarImg from './AvatarImg.svelte';
  import CustomButton from './CustomButton.svelte';

  export let currentUserData: UserType;
  export let btnContent: string;
  export let textAreaRows = 5;
  export let textAreaCols = 66;

  let messageContent = '';
  const username = currentUserData.username;
  const userImgPath = currentUserData.image;
  let isContentValid: boolean;
  $: isContentValid = messageContent.length < 1;

  const svelteDispatcher = createEventDispatcher();
  /**
   *
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
        bind:value="{messageContent}"></textarea>
    </div>
    <div class="new-cc__btn-cont">
      <CustomButton
        btnContent="{btnContent}"
        isDisabled="{isContentValid}"
        on:click="{replyEventHandler}"
      />
    </div>
  </div>
  {#if isContentValid}
    <p class="text-error">Please enter some text to reply</p>
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
    color: var(--clr-pri-harshRed);
    margin-top: ($padding-box - 0.5rem) * -1;
    padding-left: 1.5rem;
  }
</style>
