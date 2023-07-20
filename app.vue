<template>
  <div class="min-h-screen overflow-hidden bg-white dark:bg-gray-900 relative isolate">
    <div class="fixed h-screen w-screen top-0">
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
            class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"/>
      </div>
      <div class="absolute inset-x-0 top-30 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-50" aria-hidden="true">
        <div
            class="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"/>
      </div>
      <div class="absolute inset-x-0 top-72 -z-10 transform-gpu overflow-hidden blur-2xl sm:top-72" aria-hidden="true">
        <div
            class="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-20 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            style="clip-path: polygon(78.86% 57.97%, 84.41% 43.91%, 94.21% 37.52%, 69.93% -2.4%, 74.9% 40.65%, 71.03% 56.69%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 72.55% 97.99%, 79.37% 74.19%)"/>
      </div>
    </div>

    <div class="max-w-4xl mx-auto">
      <!-- Title thing -->
      <div class="py-12">
        <NuxtLink to="/">
          <h1 class="text-4xl font-semibold text-black dark:text-white">
            Sourcecode's Security Blog <span class="font-normal">🧑‍💻</span>
          </h1>
        </NuxtLink>
        <p class="text-gray-800 dark:text-gray-300 max-w-xl">
          I'm currently studying computer science in The Netherlands and practicing
          a lot of CTF's to work my way into a cybersecurity job.
        </p>
      </div>

      <NuxtPage/>
    </div>
  </div>
</template>