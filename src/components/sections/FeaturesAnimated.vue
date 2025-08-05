<template>
  <section class="w-full mt-48 md:mt-20 lg:mt-0 py-12 md:pb-24 lg:pb-32 xl:pb-48 bg-card/30 z-50">
    <div class="relative">
      <div class="container space-y-12 px-4 md:px-6 relative max-w-7xl mx-auto">
        <div class="flex flex-col items-start md:items-center justify-center space-y-4 text-left md:text-center animate-fade-in-up">
          <div class="space-y-2 mb-8">
            <div class="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
            <h2 class="text-3xl font-bold tracking-tight sm:text-5xl">Why Choose UCAN</h2>
            <p class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              UCAN provides powerful authorization capabilities with cryptographic security, offline functionality, and decentralized architecture.
            </p>
          </div>
        </div>
        
        <div class="mx-auto grid max-w-6xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="grid gap-4 animate-fade-in-up"
            :style="`animation-delay: ${0.3 + (index * 0.1)}s`"
          >
            <div class="bg-card rounded-lg p-6 flex items-start gap-4 card-hover-effect">
              <div class="feature-icon">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.iconPath"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold">{{ feature.title }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="hidden lg:block absolute top-24 left-[22%] w-[800px] h-[40px] bg-primary rounded-full filter blur-3xl opacity-40 animate-fade-in" style="animation-delay: 1s" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buttonVariants } from "../ui/button"

// Features data
const features = [
  {
    title: "Cryptographic Security",
    description: "All authorizations are cryptographically signed and verifiable without contacting the issuer, ensuring maximum security.",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  },
  {
    title: "Decentralized", 
    description: "No central server required for permission verification. Operate completely offline with peer-to-peer authorization.",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z"
  },
  {
    title: "Fine-Grained Control",
    description: "Delegate specific capabilities with custom constraints, time limits, and precise scope control.",
    iconPath: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  },
  {
    title: "Time-Limited Access",
    description: "Set expiration times for temporary permissions and automatic revocation when time limits expire.",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  },
  {
    title: "Composable",
    description: "Chain and combine UCANs to create complex authorization flows while maintaining security guarantees.",
    iconPath: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
  },
  {
    title: "Revocable",
    description: "Withdraw access when needed with built-in revocation mechanisms and blacklisting support.",
    iconPath: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
  }
]
</script>
