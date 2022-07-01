<script lang="ts">
  import '../reset.css';
  import '../app.css';
</script>

<main class="comments-section">
  <slot />
</main>

<style>
  .comments-section {
    margin-left: auto;
    margin-right: auto;
    max-width: 60rem;
  }
</style>