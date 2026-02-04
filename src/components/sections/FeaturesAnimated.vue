<template>
  <section class="w-full mt-32 md:mt-20 lg:mt-0 py-12 md:pb-24 lg:pb-32 xl:pb-48 bg-card/30 z-50">
    <div class="relative">
      <div class="container space-y-12 px-4 md:px-6 relative max-w-7xl mx-auto">
        <div class="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up">
          <div class="space-y-2 mb-8">
            <div class="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
            <h2 class="text-3xl font-bold tracking-tight sm:text-5xl">Why Choose UCAN</h2>
            <p class="max-w-225 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
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
                <component :is="feature.icon" class="w-6 h-6 text-primary" />
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
      
      <div class="hidden lg:block absolute top-24 left-[22%] w-[800px] h-10 bg-primary rounded-full filter blur-3xl opacity-40 animate-fade-in" style="animation-delay: 1s" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { CircleCheck, Zap, Settings, Clock, Link, RefreshCw } from 'lucide-vue-next'

// Features data
const features = [
  {
    title: "Cryptographic Security",
    description: "All authorizations are cryptographically signed and verifiable without contacting the issuer, ensuring maximum security.",
    icon: CircleCheck
  },
  {
    title: "Decentralized", 
    description: "No central server required for permission verification. Operate completely offline with peer-to-peer authorization.",
    icon: Zap
  },
  {
    title: "Fine-Grained Control",
    description: "Delegate specific capabilities with custom constraints, time limits, and precise scope control.",
    icon: Settings
  },
  {
    title: "Time-Limited Access",
    description: "Set expiration times for temporary permissions and automatic revocation when time limits expire.",
    icon: Clock
  },
  {
    title: "Composable",
    description: "Chain and combine UCANs to create complex authorization flows while maintaining security guarantees.",
    icon: Link
  },
  {
    title: "Revocable",
    description: "Withdraw access when needed with built-in revocation mechanisms and blacklisting support.",
    icon: RefreshCw
  }
]
</script>
