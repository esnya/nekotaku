<template lang="pug">
  v-card.neko-bottom-toolbar
    v-card-actions(align-end)
      slot
</template>

<style lang="stylus" scoped>
.neko-bottom-toolbar
  position fixed
  bottom 56px
  width 100%
</style>
