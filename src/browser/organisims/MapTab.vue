<template lang="pug">
  .neko-map-tab(v-if="map")
    map-container(:map="map")
    map-control(:map="map")
</template>

<script>
import MapContainer from '@/browser/organisims/MapContainer.vue';
import MapControl from '@/browser/organisims/MapControl.vue';
import { bindAsObject } from '@/browser/models';

export default {
  mixins: [
    bindAsObject('map'),
  ],
  components: {
    MapContainer,
    MapControl,
  },
};
</script>

<style lang="stylus" scoped>
.neko-map-tab
  position fixed
  width 100vw
  height 100vh
  top 0
  left 0/

  overflow auto
  --webkit-overflow-scrolling touch
</style>
