<template>
  <div class="w-[100%] h-[300px] bg-card rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden border border-border">
    <!-- UCAN Flow Visualization -->
    <svg class="w-full h-full" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Arrow marker -->
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
        </marker>
      </defs>
      
      <!-- Title -->
      <text x="300" y="25" text-anchor="middle" fill="#1e293b" font-size="16" font-weight="bold">UCAN Delegation Chain</text>
      <text x="300" y="43" text-anchor="middle" fill="#64748b" font-size="11">Cryptographically secure delegation without central authority</text>
      
      <!-- Alice -->
      <g class="animate-fade-in" style="animation-delay: 0.5s">
        <circle cx="120" cy="135" r="30" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <text x="120" y="141" text-anchor="middle" fill="#475569" font-size="18" font-weight="bold">A</text>
        <text x="120" y="180" text-anchor="middle" fill="#1e293b" font-size="12" font-weight="600">Alice</text>
        <text x="120" y="195" text-anchor="middle" fill="#64748b" font-size="10">Owner</text>
      </g>
      
      <!-- Bob -->
      <g class="animate-fade-in" style="animation-delay: 0.7s">
        <circle cx="300" cy="135" r="30" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <text x="300" y="141" text-anchor="middle" fill="#475569" font-size="18" font-weight="bold">B</text>
        <text x="300" y="180" text-anchor="middle" fill="#1e293b" font-size="12" font-weight="600">Bob</text>
        <text x="300" y="195" text-anchor="middle" fill="#64748b" font-size="10">Delegate</text>
      </g>
      
      <!-- Charlie -->
      <g class="animate-fade-in" style="animation-delay: 0.9s">
        <circle cx="480" cy="135" r="30" fill="#f0fdf4" stroke="#84cc16" stroke-width="2"/>
        <text x="480" y="141" text-anchor="middle" fill="#65a30d" font-size="18" font-weight="bold">C</text>
        <text x="480" y="180" text-anchor="middle" fill="#1e293b" font-size="12" font-weight="600">Charlie</text>
        <text x="480" y="195" text-anchor="middle" fill="#64748b" font-size="10">End User</text>
      </g>
      
      <!-- Arrow 1 with label -->
      <g class="animate-fade-in" style="animation-delay: 1.1s">
        <path d="M 150 135 L 270 135" stroke="#64748b" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
        <rect x="190" y="112" width="50" height="16" rx="8" fill="white" stroke="#cbd5e1" stroke-width="1"/>
        <text x="215" y="123" text-anchor="middle" fill="#64748b" font-size="9" font-weight="600">UCAN</text>
        <text x="210" y="105" text-anchor="middle" fill="#64748b" font-size="9">Delegate</text>
      </g>
      
      <!-- Arrow 2 with label -->
      <g class="animate-fade-in" style="animation-delay: 1.3s">
        <path d="M 330 135 L 450 135" stroke="#64748b" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
        <rect x="370" y="112" width="50" height="16" rx="8" fill="white" stroke="#cbd5e1" stroke-width="1"/>
        <text x="395" y="123" text-anchor="middle" fill="#64748b" font-size="9" font-weight="600">UCAN</text>
        <text x="390" y="105" text-anchor="middle" fill="#64748b" font-size="9">Sub-delegate</text>
      </g>
      
      <!-- Resource -->
      <g class="animate-fade-in" style="animation-delay: 1.5s">
        <rect x="250" y="240" width="60" height="28" rx="6" fill="white" stroke="#cbd5e1" stroke-width="2"/>
        <text x="280" y="258" text-anchor="middle" fill="#374151" font-size="11" font-weight="600">Files</text>
      </g>
      
      <!-- Access arrow -->
      <g class="animate-fade-in" style="animation-delay: 1.7s">
        <path d="M 465 165 Q 430 205 295 240" stroke="#84cc16" stroke-width="2" fill="none" stroke-dasharray="5,3"/>
        <text x="385" y="220" text-anchor="middle" fill="#65a30d" font-size="10" font-weight="600">Access Files</text>
      </g>
      
      <!-- Step indicators -->
      <g class="animate-fade-in" style="animation-delay: 1.9s">
        <circle cx="90" cy="85" r="10" fill="#e2e8f0"/>
        <text x="90" y="89" text-anchor="middle" fill="#64748b" font-size="9" font-weight="600">1</text>
        
        <circle cx="270" cy="85" r="10" fill="#e2e8f0"/>
        <text x="270" y="89" text-anchor="middle" fill="#64748b" font-size="9" font-weight="600">2</text>
        
        <circle cx="450" cy="85" r="10" fill="#e2e8f0"/>
        <text x="450" y="89" text-anchor="middle" fill="#64748b" font-size="9" font-weight="600">3</text>
        
        <circle cx="530" cy="85" r="10" fill="#dcfce7"/>
        <text x="530" y="89" text-anchor="middle" fill="#65a30d" font-size="9" font-weight="600">✓</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
// This component displays the UCAN delegation chain illustration
// showing how authorization flows from Alice → Bob → Charlie
</script>
