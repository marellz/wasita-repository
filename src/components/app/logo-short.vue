<template>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 2084 2084"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    xmlns:serif="http://www.serif.com/"
    style="
      fill-rule: evenodd;
      clip-rule: evenodd;
      stroke-linejoin: round;
      stroke-miterlimit: 2;
    "
    :fill
  >
    <rect
      id="logo"
      x="0"
      y="0"
      width="2083.6"
      height="2083.6"
      style="fill: none"
    />
    <path
      d="M1595.9,1957.91l-737.645,-667.234l743.373,-752.671l-5.728,1419.9Zm-1419.19,-1809.85l2.351,1802.83l1781.04,-1804.18l-1783.39,1.353Zm1218.22,1354.6l-243.478,-220.237c0,0 245.369,-248.438 245.369,-248.438l-1.891,468.675Zm-1015.15,-1151.95l1094.78,-0.83c0,-0 -1093.33,1107.54 -1093.33,1107.54l-1.443,-1106.71Z"
    />
  </svg>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    fill?: string
  }>(),
  {
    fill: "#000",
  },
)
</script>
