<script lang='ts'>
  import type { UserType } from '$lib/data/data-store_types';

  import { createEventDispatcher } from 'svelte';

  import AvatarImg from '$lib/components/AvatarImg.svelte';
  import CustomButton from '$lib/components/CustomButton.svelte';

  export let currentUserData: UserType;
  export let btnContent: string;
  export let textAreaRows = 5;
  export let textAreaCols = 66;

  let messageContent: string;
  const username = currentUserData.username;
  const userImgPath = currentUserData.image;

  const dispatchEvent = createEventDispatcher();

  /**
   *
   */
  function replyEventHandler() {
    dispatchEvent('replyEvent', messageContent);
  }
</script>

<div class='new-cc'>
  <div class='new-cc-cont'>
    <div class='new-cc__avatar-cont'>
      <AvatarImg {username} {userImgPath} imgHeight={40} imgWidth={40} />
    </div>
    <div class='new-cc__input-cont'>
      <textarea
        class='new-cc__textarea'
        name='new-content'
        id='new-content'
        cols={textAreaCols}
        rows={textAreaRows}
        spellcheck='true'
        bind:value={messageContent}
      />
    </div>
    <div class='new-cc__btn-cont'>
      <CustomButton {btnContent} on:click={replyEventHandler} />
    </div>
  </div>
</div>

<style lang='scss'>
  .new-cc {
    &-cont {
      align-items: flex-start;
      background-color: var(--clr-nutrl-pureWhite);
      border-radius: var(--brdr-radius);
      display: flex;
      justify-content: space-between;
      margin-top: 3rem;
      padding: 1.5rem;
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
</style>
