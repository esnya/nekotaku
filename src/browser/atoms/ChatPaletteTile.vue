<template lang="pug">
  v-list-tile(@click="$emit('click', $event)")
    v-list-tile-action
      v-icon palette
    v-list-tile-content
      v-list-tile-title チャットパレット
</template>
