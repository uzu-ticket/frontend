<template>
  <div class="secure-img-wrapper" :class="wrapperClass">
    <!-- Loading skeleton -->
    <div v-if="state === 'loading'" class="secure-img-skeleton" />

    <!-- Error / fallback state -->
    <slot v-else-if="state === 'error' || !displayUrl" name="fallback">
      <div class="secure-img-fallback">
        <img
          v-if="fallbackSrc"
          :src="fallbackSrc"
          :alt="alt"
          class="secure-img"
          :class="imgClass"
          :style="{ objectFit }"
        />
        <svg
          v-else-if="fallbackIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          class="secure-img-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 18h16.5M3.75 4.5h16.5A2.25 2.25 0 0 1 22.5 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 17.25V6.75A2.25 2.25 0 0 1 3.75 4.5z"
          />
        </svg>
      </div>
    </slot>

    <!-- Successfully resolved image -->
    <img
      v-else
      :src="displayUrl"
      :alt="alt"
      class="secure-img"
      :class="imgClass"
      :style="{ objectFit }"
      @error="onImgError"
    />
  </div>
</template>

<script setup lang="ts">
import type { EventImage } from "~/types/event";
import type { SecureImageSource } from "~/composables/useSecureImage";

const props = withDefaults(
  defineProps<{
    /** Image URL, S3 URL, S3 key, local path, or preview data URL */
    src?: string | null;
    /** Or an EventImage / image object */
    image?: EventImage | SecureImageSource | null;
    /** Organisation ID (defaults to active org from state) */
    organisationId?: string;
    /** Alt text */
    alt?: string;
    /** Extra CSS classes on outer wrapper div */
    wrapperClass?: string;
    /** Extra CSS classes on <img> element */
    imgClass?: string;
    /** CSS object-fit style */
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    /** Fallback image URL when image is missing or failed */
    fallbackSrc?: string;
    /** Whether to show default SVG icon on fallback */
    fallbackIcon?: boolean;
  }>(),
  {
    src: null,
    image: null,
    organisationId: undefined,
    alt: "Image",
    wrapperClass: "",
    imgClass: "",
    objectFit: "cover",
    fallbackSrc: undefined,
    fallbackIcon: true,
  },
);

type State = "loading" | "ready" | "error";

const state = ref<State>("loading");
const displayUrl = ref<string | null>(null);

const { resolveSecureUrl } = useSecureImage();

async function resolve() {
  const source = props.image || props.src;
  if (!source) {
    state.value = "error";
    displayUrl.value = null;
    return;
  }

  state.value = "loading";
  try {
    const resolved = await resolveSecureUrl(source, {
      organisationId: props.organisationId,
    });

    if (resolved) {
      displayUrl.value = resolved;
      state.value = "ready";
    } else {
      state.value = "error";
      displayUrl.value = null;
    }
  } catch {
    state.value = "error";
    displayUrl.value = null;
  }
}

function onImgError(e: Event) {
  console.warn("[SecureImage] <img> failed to render src:", displayUrl.value, e);
  state.value = "error";
}

watch(
  () => [props.src, props.image, props.organisationId],
  () => {
    resolve();
  },
  { immediate: true, deep: true },
);
</script>

<style scoped>
.secure-img-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.secure-img-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #1e2130 25%, #252a3d 50%, #1e2130 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.secure-img-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1f2e;
  color: #4b5280;
}

.secure-img-icon {
  width: 2.25rem;
  height: 2.25rem;
  opacity: 0.5;
}

.secure-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
