<script lang="ts">
  export let imgSrc: string;
  export let descriptionText: string;
  export let dataAction = '';
  export let isDelete = false;
  export let isDisabled = false;
</script>

<!-- Check if dataAction has been provided or else it defaults to empty string which is falsy
     if dataAction is passed use descriptionText -->
<button
  class="iconShake"
  class:delete="{isDelete}"
  data-action="{dataAction || descriptionText.toLowerCase()}"
  disabled="{isDisabled}"
  aria-label="{descriptionText} btn"
  on:click
>
  <span>
    <img class="iconShake__img" src="{imgSrc}" alt="{descriptionText} icon" />
    <p class="iconShake__content">{descriptionText}</p>
  </span>
</button>

<style lang="scss">
  .iconShake {
    align-items: center;
    color: var(--clr-pri-moderateBlue);
    display: flex;
    padding: 0.2rem 0.4rem;

    &:hover,
    &:focus-within {
      filter: brightness(170%);
    }

    > span {
      align-items: center;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    &__img {
      margin-right: 0.5rem;
      max-height: 1.4rem;
    }

    &__content {
      color: inherit;
      font-size: 1.5rem;
      font-weight: 500;
      text-transform: capitalize;
    }
  }

  .iconShake[disabled] {
    cursor: default;
    filter: saturate(0) brightness(140%);
  }

  .delete.iconShake:not([disabled]) {
    color: var(--clr-pri-softRed);
    filter: brightness(180%);

    /* Set different values for light red delete btn */
    &:hover,
    &:focus-within {
      filter: none;
    }
  }
</style>
