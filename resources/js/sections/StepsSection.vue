<template>
  <div class="px-4 py-16 mb-10 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
    <div class="max-w-xl mb-10 md:mx-auto text-center lg:max-w-2xl md:mb-12">
      <h2 class="max-w-lg mb-6 font-sans text-3xl text-center font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
        {{ $t("it's easier than you think") }}
      </h2>
      <p class="text-base text-gray-700 md:text-lg">
          {{ $t("intuitive clear interface") }}
      </p>
    </div>
    <div class="grid gap-8 row-gap-8 lg:grid-cols-3">
      <div class="text-center flex flex-col items-center justify-center">
        <div class="flex items-center justify-center w-24 h-24 mb-4 text-5xl font-extrabold rounded-full text-deep-purple-accent-400 bg-indigo-50 sm:mx-auto">
          1
        </div>
        <h6 class="mb-2 font-semibold leading-5">{{ $t("select a template") }}</h6>
        <p class="max-w-xs mb-3 text-sm text-gray-900 sm:mx-auto">
            {{ $t("change the text of the selected template to your liking") }}
        </p>
      </div>
      <div class="text-center flex flex-col items-center justify-center">
        <div class="flex items-center justify-center w-24 h-24 mb-4 text-5xl font-extrabold rounded-full text-deep-purple-accent-400 bg-indigo-50 sm:mx-auto">
          2
        </div>
        <h6 class="mb-2 font-semibold leading-5">{{ $t("fill out the form") }}</h6>
        <p class="max-w-xs mb-3 text-sm text-gray-900 sm:mx-auto">
            {{ $t("enter the information you want your guests to see") }}
        </p>
      </div>
      <div class="text-center flex flex-col items-center justify-center">
        <div class="flex items-center justify-center w-24 h-24 mb-4 text-5xl font-extrabold rounded-full text-deep-purple-accent-400 bg-indigo-50 sm:mx-auto">
          3
        </div>
        <h6 class="mb-2 font-semibold leading-5">{{ $t("send invitations to your guests") }}</h6>
        <p class="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto">
            {{ $t("invite your guests through social networks in your personal account") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StepsSection"
}
</script>

<style scoped>

</style>
