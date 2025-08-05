<template>
  <div class="w-full flex-col items-center justify-center flex pt-20 lg:pt-32 relative z-10 px-4 md:px-0">
    <h1
      class="text-5xl lg:text-[4.25rem] font-bold tracking-tight mb-4 mt-12 lg:mt-0 text-center animate-fade-in-up"
      style="animation-delay: 0s"
    >
      Decentralized Authorization
    </h1>
    
    <p
      class="text-muted-foreground text-lg lg:text-xl max-w-xl lg:max-w-2xl text-center animate-fade-in-up"
      style="animation-delay: 0.15s"
    >
      UCAN is a trustless, secure, local-first authorization network that puts users in control of their permissions — no central authority required.
    </p>

    <div
      class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up"
      style="animation-delay: 0.2s"
    >
      <a :href="specUrl" :class="buttonClasses.primary">
        <svg class="size-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
        <span class="font-bold">Read Specification</span>
      </a>
      
      <a :href="startUrl" :class="buttonClasses.secondary">
        <svg class="size-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6-4h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"/>
        </svg>
        Get Started
      </a>
    </div>

    <div
      class="hidden md:flex justify-center relative overflow-hidden pt-24 lg:pt-32 animate-fade-in-up"
      style="animation-delay: 0.3s"
    >
      <UcanIllustration />

      <div
        class="hidden lg:block absolute top-42 left-[5%] w-11/12 h-[300px] bg-primary rounded-full filter blur-[72px] opacity-40 -z-10 animate-fade-in"
        style="animation-delay: 0.8s"
      />
      <div class="absolute inset-0 z-30" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buttonVariants } from "../ui/button"
import UcanIllustration from "../UcanIllustration.vue"

// Props
const specUrl = '/specification/'
const startUrl = '/getting-started/'

// Computed button classes
const buttonClasses = computed(() => ({
  primary: buttonVariants({ variant: "default", size: "lg" }),
  secondary: buttonVariants({ variant: "secondary", size: "lg" })
}))
</script>
