<script lang="ts">
  import type { ImgType } from '../../../scripts/data/data-store_types';

  export let username: string;
  export let userImgPath: ImgType;
  export let imgWidth = 40;
  export let imgHeight = 35;
</script>

<picture>
  <source srcset="{userImgPath.webp}" type="image/webp" />
  <img
    src="{userImgPath.png}"
    width="{imgWidth}"
    height="{imgHeight}"
    loading="lazy"
    decoding="async"
    alt="profile picture of {username}"
    class="cc__content-pic"
  />
</picture>
