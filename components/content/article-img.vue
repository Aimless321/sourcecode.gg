<template>
  <nuxt-img
      class="isolate rounded-md"
      :src="src"
      :alt="alt"
      sizes="xl:100vw lg:100vw md:100vw sm:100vw xs:100vw"
  />
</template>

<script setup>
const props = defineProps(['src', 'alt'])
</script>