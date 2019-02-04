<template lang="pug">
  .loading-container
    v-progress-circular.primary--text(indeterminate :size="50")
    div.py-2 なう、ろーでぃんぐ。
</template>

<style lang="stylus" scoped>
.loading-container
  position fixed
  top 0
  left 0
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
</style>
