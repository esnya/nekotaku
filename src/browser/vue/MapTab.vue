<template lang="pug">
  div.map(v-if="map")
    map-view.map-view
    map-control.map-control
  loading(v-else)
</template>

<script>
import { mapState } from 'vuex';
import Loading from './Loading.vue';
import MapControl from './MapControl.vue';
import MapView from './MapView.vue';

export default {
  components: {
    Loading,
    MapControl,
    MapView,
  },
  computed: mapState([
    'map',
  ]),
};
</script>

<style lang="stylus" scoped>
  .map
    height: 100%;
    display: flex;
    flex-direction: column;

    .map-view
      flex: 1 1 0;

    .map-control
      flex: 0 0 auto;
</style>
