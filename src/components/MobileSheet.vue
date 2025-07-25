<template>
  <div class="md:hidden">
    <button
      @click="isOpen = !isOpen"
      class="p-2 hover:bg-accent rounded-md"
      aria-label="Toggle menu"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/40 p-4"
    >
      <nav class="flex flex-col gap-4">
        <template v-for="link in mainNavLinks" :key="link.href">
          <a :href="link.href" class="hover:text-primary transition-colors">
            {{ link.label }}
          </a>
        </template>
        <div class="flex flex-col gap-2 pt-4 border-t border-border/40">
          <template v-for="action in actionLinks" :key="action.href">
            <a :href="action.href" :class="buttonVariants({ variant: action.variant, size: 'sm' })">
              {{ action.label }}
            </a>
          </template>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { buttonVariants } from "./ui/button"
import { mainNavLinks, actionLinks } from "../config/nav.config"

const isOpen = ref(false)
</script>
