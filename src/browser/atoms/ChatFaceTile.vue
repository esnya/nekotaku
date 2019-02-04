<template lang="pug">
  v-list-tile(@click="$emit('click', $event)")
    v-list-tile-action
      v-icon mdi-emoticon
    v-list-tile-content
      v-list-tile-title 立ち絵表情
</template>
