<template lang="pug">
  .loading-container
    v-progress-circular.primary--text(indeterminate, :size="50")
    div.py-2 なう、ろーでぃんぐ。
</template>

<style lang="stylus" scoped>
.loading-container
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
</style>
