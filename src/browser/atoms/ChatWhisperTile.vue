<template lang="pug">
  v-list-tile(@click="$emit('click', $event)")
    v-list-tile-action
      v-icon mdi-message-settings-variant
    v-list-tile-content
      v-list-tile-title 秘話設定
</template>
