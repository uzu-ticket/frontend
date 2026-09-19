<template>
  <div class="wallet-banner-graphic" aria-hidden="true">
    <!-- Scattered background outline icons on the right side -->
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="scattered-icons-svg">
      <!-- 1. Small Wallet Outline Icon (Top Left of right section) -->
      <g transform="translate(30, 25) scale(0.7)" opacity="0.3" stroke="#FFFFFF" stroke-width="1.8">
        <rect x="2" y="6" width="22" height="16" rx="4" />
        <path d="M2 10 H24" />
        <rect x="16" y="12" width="6" height="5" rx="1.5" />
      </g>

      <!-- 2. 'C' Refresh Icon (Top Center) -->
      <g transform="translate(130, 15) scale(0.75)" opacity="0.35" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round">
        <path d="M18 8 A 9 9 0 1 1 8 5" />
        <path d="M8 1 V6 H13" />
      </g>

      <!-- 3. Small Wallet Outline Icon (Top Right) -->
      <g transform="translate(240, 20) scale(0.65)" opacity="0.25" stroke="#FFFFFF" stroke-width="1.8">
        <rect x="2" y="6" width="22" height="16" rx="4" />
        <path d="M2 10 H24" />
        <rect x="16" y="12" width="6" height="5" rx="1.5" />
      </g>

      <!-- 4. 'C' Refresh Icon (Middle Left) -->
      <g transform="translate(60, 115) scale(0.7)" opacity="0.3" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round">
        <path d="M18 8 A 9 9 0 1 1 8 5" />
        <path d="M8 1 V6 H13" />
      </g>

      <!-- 5. 'C' Refresh Icon (Bottom Center) -->
      <g transform="translate(180, 155) scale(0.75)" opacity="0.35" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round">
        <path d="M18 8 A 9 9 0 1 1 8 5" />
        <path d="M8 1 V6 H13" />
      </g>

      <!-- 6. Small Wallet Outline Icon (Bottom Right) -->
      <g transform="translate(270, 140) scale(0.65)" opacity="0.25" stroke="#FFFFFF" stroke-width="1.8">
        <rect x="2" y="6" width="22" height="16" rx="4" />
        <path d="M2 10 H24" />
        <rect x="16" y="12" width="6" height="5" rx="1.5" />
      </g>
    </svg>

    <!-- Main Wallet Image (/wallet.png) pushed further to the right -->
    <div class="wallet-img-wrapper">
      <img src="/wallet.png" alt="Wallet Illustration" class="wallet-img" />
    </div>
  </div>
</template>

<style scoped>
.wallet-banner-graphic {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 360px;
  pointer-events: none;
  overflow: hidden;
}

.scattered-icons-svg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.wallet-img-wrapper {
  position: absolute;
  right: 0.25rem;
  bottom: 0;
  top: 0;
  width: 240px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.wallet-img {
  max-width: 105%;
  max-height: 105%;
  object-fit: contain;
  transform: translateX(10px);
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
}

@media (max-width: 850px) {
  .wallet-banner-graphic {
    width: 240px;
  }
  .wallet-img-wrapper {
    width: 180px;
    right: 0;
  }
}

@media (max-width: 640px) {
  .wallet-banner-graphic {
    display: none;
  }
}
</style>
