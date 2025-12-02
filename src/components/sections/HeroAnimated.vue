<template>
  <div class="w-full flex-col items-center justify-center flex pt-20 lg:pt-32 relative z-10 px-4 md:px-0">
    <h1
      class="text-4xl lg:text-6xl font-bold tracking-tight mb-3 mt-8 lg:mt-0 text-center animate-fade-in-up"
      style="animation-delay: 0s"
    >
      Zero-Trust Auth,<br/>for Apps and AI
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
        <BookOpen class="size-4 mr-2" />
        <span class="font-bold">Read Specification</span>
      </a>
      
      <a :href="startUrl" :class="buttonClasses.secondary">
        <Zap class="size-4 mr-2" />
        Get Started
      </a>
    </div>

    <div
      class="hidden w-full md:flex justify-center relative overflow-hidden pt-8 lg:pt-8 animate-fade-in-up"
      style="animation-delay: 0.3s"
    >
      <UcanBenefitsIllustration />
      <div class="absolute inset-0 z-30" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Zap, BookOpen } from 'lucide-vue-next'
import { buttonVariants } from "../ui/button"
import UcanBenefitsIllustration from "../UcanBenefitsIllustration.vue"

// Props
const specUrl = '/specification/'
const startUrl = '/getting-started/'

// Computed button classes
const buttonClasses = computed(() => ({
  primary: buttonVariants({ variant: "default", size: "lg" }),
  secondary: buttonVariants({ variant: "secondary", size: "lg" })
}))
</script>
