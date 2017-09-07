<template lang="pug">
svg.neko-svg-icon(width="24", height="24")
  g
    slot
</template>

<style lang="stylus" scoped>
.neko-svg-icon
  > g
    transform translate(12px, 12px)
    fill none
    stroke rgba(0,0,0,.54)
    stroke-width 1

.primary
.text--primary
.primary--text
  .neko-svg-icon > g
    stroke #1976d2
</style>
