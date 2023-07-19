<template>
  <article class="rounded-2xl py-2 px-6 bg-gray-400/10 dark:bg-white/10">
    <h3 class="text-xl inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff80b5] to-[#9089fc]">
      {{ props.title }}
    </h3>
    <time class="block text-gray-600 dark:text-gray-400" :datetime="props.date">{{ new Date(Date.parse(props.date)).toLocaleDateString() }}</time>
    <p class="text-gray-700 dark:text-gray-300">
      {{ props.description }}
    </p>
  </article>
</template>

<script setup>
const props = defineProps(['title', 'description', 'date'])
</script>