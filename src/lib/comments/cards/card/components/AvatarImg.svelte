<script lang="ts">
  import type { ImgType } from '../../../../data/data-store_types';

  export let username: string;
  export let userImgPath: ImgType;
  export let imgWidth = 40;
  export let imgHeight = 35;
</script>

<picture>
  <source srcset="{userImgPath.webp}" type="image/webp" />
  <img
    width="{imgWidth}px"
    height="{imgHeight}px"
    loading="lazy"
    decoding="async"
    src="{userImgPath.png}"
    alt="profile picture of {username}"
    class="cc__content-pic"
  />
</picture>
