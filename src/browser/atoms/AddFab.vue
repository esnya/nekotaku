<template lang="pug">
  v-tooltip
    v-btn(
      fab
      fixed
      bottom
      right
      color="primary"
      slot="activator"
      @click="$emit('click', $event)"
    )
      v-icon add
    span 追加
</template>
