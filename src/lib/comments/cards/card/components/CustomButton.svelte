<script lang="ts">
  export let btnContent: string;
  export let isDisabled = false;
  // todo add hover state like duolingo
</script>

<button class="gp-btn" disabled={isDisabled} on:click>{btnContent}</button>

<style lang="scss">
  .gp-btn {
    background-color: var(--clr-pri-moderateBlue);
    border-radius: calc(var(--brdr-radius) - 3px);
    color: var(--clr-nutrl-pureWhite);
    font-size: 1.4rem;
    font-weight: 500;
    padding: 0.8rem 2rem;
    text-transform: uppercase;
  }

  .gp-btn[disabled] {
    cursor: default;
    filter: saturate(0) brightness(140%);
  }
</style>
