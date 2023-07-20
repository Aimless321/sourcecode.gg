<template>
  <!-- Article overview -->
  <div class="my-8 flex justify-between gap-4">
    <!-- Articles -->
    <div>
      <h2 class="text-2xl text-gray-900 dark:text-white">Articles</h2>
      <ContentNavigation v-slot="{ navigation }">
        <ul class="flex flex-col gap-4">
          <li v-for="link of navigation" :key="link._path">
            <NuxtLink :to="link._path">
              <article-listing :title="link.title" :description="link.description" :date="link.publishedAt" />
            </NuxtLink>
          </li>
        </ul>
      </ContentNavigation>

    </div>
  </div>
</template>
<script>
import ArticleListing from "../components/article-listing";

export default {
  components: {ArticleListing}
}
</script>