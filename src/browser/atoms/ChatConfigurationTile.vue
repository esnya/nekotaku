<template lang="pug">
  v-list-tile(@click="$emit('click', $event)")
    v-list-tile-action
      v-icon mdi-account-multiple
    v-list-tile-content
      v-list-tile-title チャット設定
</template>
