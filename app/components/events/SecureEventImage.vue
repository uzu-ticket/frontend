<template>
  <SecureImage
    :image="image"
    :src="image?.url"
    :alt="alt"
    :wrapper-class="wrapperClass"
    :img-class="imgClass"
  />
</template>

<script setup lang="ts">
import type { EventImage } from "~/types/event";

withDefaults(
  defineProps<{
    /** The EventImage record from the API */
    image?: EventImage | null;
    /** Fallback alt text */
    alt?: string;
    /** Extra CSS classes applied to the outer wrapper div */
    wrapperClass?: string;
    /** Extra CSS classes applied to the <img> element */
    imgClass?: string;
  }>(),
  {
    image: null,
    alt: "Event image",
    wrapperClass: "",
    imgClass: "",
  },
);
</script>
