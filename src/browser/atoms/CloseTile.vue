<template lang="pug">
  v-list-tile(@click="$emit('click', $event)")
    v-list-tile-content
    v-list-tile-action
      v-icon close
</template>
