<template lang="pug">
  v-tooltip
    v-btn(
      icon
      slot="activator"
      @click="$emit('click', $event)"
    )
      v-icon edit
    span 編集
</template>
