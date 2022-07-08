<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let confirmBtnText = 'Confirm';
  export let confirmBtnClr = 'var(--clr-nutrl-grayBlue)';
  export let cancelBtnText = 'Cancel';
  export let cancelBtnClr = 'var(--clr-nutrl-grayBlue)';
  export let heading = 'Confirm';
  export let message = 'Are you sure you want to delete this item?';

  const svelteEventDispatcher = createEventDispatcher();
  /**
   * Function to handle the confirm button click event
   */
  function onConfirmEventHandler() {
    svelteEventDispatcher('confirmBtn');
  }

  /**
   * Function to handle cancel button click event
   */
  function onCancelEventHandler() {
    svelteEventDispatcher('cancelBtn');
  }
</script>

<div class="body-blur" on:click="{onCancelEventHandler}">
  <div class="content">
    <div class="heading">
      <h2>{heading}</h2>
    </div>
    <div class="message">
      <p>{message}</p>
    </div>
    <div class="buttons-cont">
      <button
        style="background-color: {cancelBtnClr};"
        class="btn cancel-btn"
        on:click="{onCancelEventHandler}"
        >{cancelBtnText}
      </button>
      <button
        style="background-color: {confirmBtnClr};"
        class="btn confirm-btn"
        on:click="{onConfirmEventHandler}"
        >{confirmBtnText}
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  .body-blur {
    background-color: hsl(0deg 0% 0% / 0.7);
    height: 100vh;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 100;
  }

  .content {
    background-color: #fff;
    border-radius: var(--brdr-radius);
    box-shadow: 0 0 5px hsl(0deg 0% 0% / 0.5);
    font-size: 1.4rem;
    left: 50%;
    max-width: 40rem;
    padding: 2.5rem;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .heading {
    margin-bottom: 0.5rem;
  }

  .heading h2 {
    color: var(--clr-nutrl-darkBlue);
    font-size: 1.5em;
    font-weight: 600;
  }

  .message {
    margin-bottom: 2.5rem;
  }

  .message p {
    color: var(--clr-nutrl-darkBlue);
    font-size: 1.2em;
  }

  .buttons-cont {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }

  .btn {
    border: none;
    border-radius: var(--brdr-radius);
    color: hsl(0deg 0% 100%);
    cursor: pointer;
    font-weight: 600;
    padding: 1rem 2rem;
    text-transform: uppercase;
  }
</style>
