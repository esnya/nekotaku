<template lang="pug">
  v-tooltip
    v-btn(
      icon
      slot="activator"
      @click="$emit('click', $event)"
    )
      v-icon close
    span 閉じる
</template>
