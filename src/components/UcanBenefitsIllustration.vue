<template>
  <div class="w-full aspect-2/1 flex items-center justify-center relative">
    <!-- UCAN Benefits Visualization -->
    <svg class="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <!-- Gradient definitions -->
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="oklch(0.54 0.25 263)" />
          <stop offset="100%" stop-color="oklch(0.54 0.25 263 / 0.8)" />
        </linearGradient>
        
        <!-- Arrow marker -->
        <marker id="benefitArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="oklch(0.54 0.25 263)" />
        </marker>
      </defs>
      
      <!-- Connection lines (rendered under circles) -->
      <g class="animate-fade-in" style="animation-delay: 2.0s">
        <path class="dash-flow-path" d="M 225 115 Q 300 130 365 160" stroke="oklch(0.54 0.25 263)" stroke-width="2" 
              fill="none" marker-end="url(#benefitArrow)" stroke-dasharray="4,2"/>
        <path class="dash-flow-path" d="M 575 115 Q 500 130 435 160" stroke="oklch(0.54 0.25 263)" stroke-width="2" 
              fill="none" marker-end="url(#benefitArrow)" stroke-dasharray="4,2"/>
        <path class="dash-flow-path" d="M 225 245 Q 300 230 365 200" stroke="oklch(0.54 0.25 263)" stroke-width="2" 
              fill="none" marker-end="url(#benefitArrow)" stroke-dasharray="4,2"/>
        <path class="dash-flow-path" d="M 575 245 Q 500 230 435 200" stroke="oklch(0.54 0.25 263)" stroke-width="2" 
              fill="none" marker-end="url(#benefitArrow)" stroke-dasharray="4,2"/>
        <path class="dash-flow-path" d="M 680 180 Q 600 180 445 180" stroke="oklch(0.54 0.25 263)" stroke-width="2" 
              fill="none" marker-end="url(#benefitArrow)" stroke-dasharray="4,2"/>
        <path class="dash-flow-path" d="M 120 180 Q 200 180 355 180" stroke="oklch(0.54 0.25 263)" stroke-width="2" 
              fill="none" marker-end="url(#benefitArrow)" stroke-dasharray="4,2"/>
      </g>
      
      <!-- Title -->
      <text x="400" y="30" text-anchor="middle" fill="oklch(0.98 0.01 240)" font-size="20" font-weight="bold" class="hidden">
        UCAN Benefits
      </text>
      <text x="400" y="48" text-anchor="middle" fill="oklch(0.67 0.02 245)" font-size="12" class="hidden">
        Trustless • Secure • Local-First • User-Controlled
      </text>
      
      <!-- Central UCAN logo/icon -->
      <g class="animate-fade-in" style="animation-delay: 1.8s">
        <circle cx="400" cy="180" r="35" fill="#F0AC5D" opacity="0.1" class="animate-pulse-delayed"/>
        <circle cx="400" cy="180" r="35" fill="none" stroke="#F0AC5D" stroke-width="3"/>
        <text x="400" y="188" text-anchor="middle" fill="#F0AC5D" font-size="16" font-weight="bold">
          UCAN
        </text>
      </g>
      
      <!-- Benefit 1: Trustless (Top Left) -->
      <g class="animate-fade-in" style="animation-delay: 0.7s">
        <circle cx="200" cy="100" r="25" fill="none" stroke="oklch(0.54 0.25 263)" stroke-width="2"/>
        <!-- ShieldX icon from Lucide -->
        <g transform="translate(192, 92)">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" 
                stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
          <path d="m15 9-6 6" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" transform="scale(0.67)"/>
          <path d="m9 9 6 6" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" transform="scale(0.67)"/>
        </g>
        <text x="200" y="140" text-anchor="middle" fill="oklch(0.98 0.01 240)" font-size="12" font-weight="600">
          Trustless
        </text>
        <text x="200" y="155" text-anchor="middle" fill="oklch(0.67 0.02 245)" font-size="10">
          No central authority
        </text>
      </g>
      
      <!-- Benefit 2: Secure (Top Right) -->
      <g class="animate-fade-in" style="animation-delay: 0.9s">
        <circle cx="600" cy="100" r="25" fill="none" stroke="oklch(0.54 0.25 263)" stroke-width="2"/>
        <!-- Lock icon from Lucide -->
        <g transform="translate(592, 92)">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
          <circle cx="12" cy="7" r="3" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
        </g>
        <text x="600" y="140" text-anchor="middle" fill="oklch(0.98 0.01 240)" font-size="12" font-weight="600">
          Secure
        </text>
        <text x="600" y="155" text-anchor="middle" fill="oklch(0.67 0.02 245)" font-size="10">
          Cryptographically signed
        </text>
      </g>
      
      <!-- Benefit 3: Local-First (Bottom Left) -->
      <g class="animate-fade-in" style="animation-delay: 1.1s">
        <circle cx="200" cy="260" r="25" fill="none" stroke="oklch(0.54 0.25 263)" stroke-width="2"/>
        <!-- Monitor icon from Lucide -->
        <g transform="translate(192, 252)">
          <rect width="20" height="14" x="2" y="3" rx="2" ry="2" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
          <line x1="8" x2="16" y1="21" y2="21" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" transform="scale(0.67)"/>
          <line x1="12" x2="12" y1="17" y2="21" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" transform="scale(0.67)"/>
        </g>
        <text x="200" y="300" text-anchor="middle" fill="oklch(0.98 0.01 240)" font-size="12" font-weight="600">
          Local-First
        </text>
        <text x="200" y="315" text-anchor="middle" fill="oklch(0.67 0.02 245)" font-size="10">
          Works offline
        </text>
      </g>
      
      <!-- Benefit 4: User-Controlled (Bottom Right) -->
      <g class="animate-fade-in" style="animation-delay: 1.3s">
        <circle cx="600" cy="260" r="25" fill="none" stroke="oklch(0.54 0.25 263)" stroke-width="2"/>
        <!-- User icon from Lucide -->
        <g transform="translate(592, 252)">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.67)"/>
          <circle cx="12" cy="7" r="4" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
        </g>
        <text x="600" y="300" text-anchor="middle" fill="oklch(0.98 0.01 240)" font-size="12" font-weight="600">
          User-Controlled
        </text>
        <text x="600" y="315" text-anchor="middle" fill="oklch(0.67 0.02 245)" font-size="10">
          You own your permissions
        </text>
      </g>
      
      <!-- Benefit 5: Scalable (Right side) -->
      <g class="animate-fade-in" style="animation-delay: 1.5s">
                <circle cx="700" cy="180" r="20" fill="none" stroke="oklch(0.54 0.25 263)" stroke-width="2"/>
        <!-- GitBranch icon from Lucide -->
        <g transform="translate(692, 172)">
          <line x1="6" x2="6" y1="3" y2="15" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" transform="scale(0.67)"/>
          <circle cx="18" cy="6" r="3" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
          <circle cx="6" cy="18" r="3" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
          <path d="m18 9c-2.5 0-4 1.5-4 4v2" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
        </g>
        <text x="700" y="215" text-anchor="middle" fill="oklch(0.98 0.01 240)" font-size="11" font-weight="600">
          Scalable
        </text>
        <text x="700" y="228" text-anchor="middle" fill="oklch(0.67 0.02 245)" font-size="9">
          Distributed
        </text>
      </g>
      
      <!-- Benefit 6: Composable (Left side) -->
      <g class="animate-fade-in" style="animation-delay: 1.7s">
                <circle cx="100" cy="180" r="20" fill="none" stroke="oklch(0.54 0.25 263)" stroke-width="2"/>
        <!-- Blocks icon from Lucide -->
        <g transform="translate(92, 172)">
          <rect width="7" height="7" x="14" y="3" rx="1" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
          <rect width="7" height="7" x="3" y="3" rx="1" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
          <rect width="7" height="7" x="14" y="14" rx="1" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
          <rect width="7" height="7" x="3" y="14" rx="1" stroke="oklch(0.54 0.25 263)" stroke-width="1.5" fill="none" transform="scale(0.67)"/>
        </g>
        <text x="100" y="215" text-anchor="middle" fill="oklch(0.98 0.01 240)" font-size="11" font-weight="600">
          Composable
        </text>
        <text x="100" y="228" text-anchor="middle" fill="oklch(0.67 0.02 245)" font-size="9">
          Chain capabilities
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
// This component displays the main benefits of UCAN in a visual diagram
// highlighting the key advantages: trustless, secure, local-first, user-controlled, scalable, and composable
</script>

<style scoped>
.animate-fade-in {
  opacity: 0;
  animation: fade-in 0.8s ease-out forwards;
}

.animate-pulse-delayed {
  animation: svg-pulse 3s ease-in-out infinite 3.0s;
  transform-origin: 400px 180px;
}

.dash-flow-path {
  animation: dash-flow 4s linear infinite 2.8s;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes svg-pulse {
  0%, 100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.2;
    transform: scale(1.2);
  }
}

@keyframes dash-flow {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -6;
  }
}
</style>
