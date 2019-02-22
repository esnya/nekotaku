<template lang="pug">
  .neko-map-tab
    map-container(:room="room")
    map-control(:room="room")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import MapContainer from '@/browser/moleculers/MapContainer.vue';
import MapControl from '@/browser/moleculers/MapControl.vue';
import Room from '@/models/Room';

@Component({
  components: {
    MapControl,
    MapContainer,
  },
})
export default class MapTab extends Vue {
  @Prop() room!: Room;
}
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
