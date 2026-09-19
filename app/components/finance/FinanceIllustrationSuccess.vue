<template>
  <div class="success-illustration" aria-hidden="true">
    <svg viewBox="0 0 540 320" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-canvas">
      <!-- Background Soft Aura -->
      <ellipse cx="270" cy="270" rx="240" ry="25" fill="#E8F8EA" />
      <path d="M120 220 C 120 140, 220 100, 360 120 C 440 135, 480 200, 480 250" stroke="#DCFCE7" stroke-width="2" stroke-dasharray="4 4" />

      <!-- Decorative Plant Leaves -->
      <path d="M410 240 Q430 180 460 170 Q440 210 410 240 Z" fill="#86EFAC" />
      <path d="M425 240 Q455 190 480 200 Q450 230 425 240 Z" fill="#4ADE80" />
      <path d="M380 240 Q360 180 340 185 Q365 210 380 240 Z" fill="#4ADE80" />

      <!-- POS Machine Stand & Body -->
      <g id="pos-terminal">
        <!-- Machine Shadow -->
        <ellipse cx="370" cy="255" rx="55" ry="12" fill="rgba(0,0,0,0.06)" />

        <!-- Machine Base (Dark Forest Green) -->
        <rect x="320" y="145" width="100" height="110" rx="16" fill="#0E2615" />

        <!-- Machine Green Front Plate -->
        <rect x="324" y="149" width="92" height="102" rx="12" fill="#3FD246" />

        <!-- Machine Screen Window (Dark) -->
        <rect x="336" y="160" width="68" height="38" rx="8" fill="#0E2615" />

        <!-- Screen Check Icon inside POS -->
        <circle cx="370" cy="179" r="12" fill="#3FD246" />
        <path d="M364 179 L368 183 L376 174" stroke="#0E2615" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Keypad Buttons Grid -->
        <circle cx="348" cy="210" r="4" fill="#15803D" />
        <circle cx="362" cy="210" r="4" fill="#15803D" />
        <circle cx="376" cy="210" r="4" fill="#15803D" />
        <circle cx="390" cy="210" r="4" fill="#15803D" />

        <circle cx="348" cy="222" r="4" fill="#15803D" />
        <circle cx="362" cy="222" r="4" fill="#15803D" />
        <circle cx="376" cy="222" r="4" fill="#15803D" />
        <circle cx="390" cy="222" r="4" fill="#15803D" />

        <circle cx="348" cy="234" r="4" fill="#15803D" />
        <circle cx="362" cy="234" r="4" fill="#15803D" />
        <circle cx="376" cy="234" r="4" fill="#15803D" />
        <circle cx="390" cy="234" r="4" fill="#15803D" />

        <!-- Receipt Paper Coming Out Top -->
        <rect x="342" y="125" width="56" height="28" rx="3" fill="#FFFFFF" stroke="#E5E7EB" />
        <line x1="348" y1="133" x2="380" y2="133" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" />
        <line x1="348" y1="140" x2="370" y2="140" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" />
      </g>

      <!-- Stack of Gold Coins next to POS Machine -->
      <g id="coins" transform="translate(425, 228)">
        <ellipse cx="20" cy="24" rx="22" ry="7" fill="#CA8A04" />
        <rect x="-2" y="16" width="44" height="8" fill="#FACC15" />
        <ellipse cx="20" cy="16" rx="22" ry="7" fill="#FEF08A" />

        <ellipse cx="20" cy="12" rx="22" ry="7" fill="#CA8A04" />
        <rect x="-2" y="4" width="44" height="8" fill="#FACC15" />
        <ellipse cx="20" cy="4" rx="22" ry="7" fill="#FEF08A" opacity="0.9" />
      </g>

      <!-- Curved Flow Dashed Line from Character to POS -->
      <path d="M295 145 Q 320 110 338 126" stroke="#0E2615" stroke-width="1.8" stroke-dasharray="3 3" />
      <!-- Golden Coin floating along the flow -->
      <circle cx="312" cy="125" r="11" fill="#FACC15" stroke="#CA8A04" stroke-width="1.5" />
      <text x="312" y="129" font-family="Outfit, sans-serif" font-size="10" font-weight="bold" fill="#854D0E" text-anchor="middle">$</text>

      <!-- Person Character -->
      <g id="character" transform="translate(130, 130)">
        <!-- Legs & Shoes -->
        <rect x="32" y="125" width="12" height="42" fill="#0E2615" />
        <rect x="56" y="125" width="12" height="42" fill="#0E2615" />
        <rect x="28" y="165" width="20" height="8" rx="3" fill="#374151" />
        <rect x="54" y="165" width="20" height="8" rx="3" fill="#374151" />

        <!-- Torso / Top -->
        <rect x="28" y="55" width="44" height="72" rx="10" fill="#FFFFFF" stroke="#E5E7EB" />
        <path d="M20 58 Q 30 75 42 75 Q 54 75 64 58" stroke="#0E2615" stroke-width="2" fill="none" />

        <!-- Head & Hair -->
        <circle cx="48" cy="30" r="16" fill="#FDBA74" />
        <path d="M34 22 C 34 10, 62 10, 62 22 C 62 30, 34 30, 34 22 Z" fill="#0E2615" />

        <!-- Oversized Green Card held by character -->
        <g transform="translate(10, 60) rotate(-6)">
          <rect width="76" height="46" rx="6" fill="#3FD246" />
          <rect x="8" y="24" width="20" height="6" rx="2" fill="#DCFCE7" />
          <rect x="8" y="34" width="35" height="4" rx="1" fill="#DCFCE7" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.success-illustration {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.svg-canvas {
  width: 100%;
  height: auto;
  max-height: 260px;
}
</style>
