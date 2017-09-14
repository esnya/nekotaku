<template lang="pug">
  v-layout(v-if="map" column)
    v-flex(v-scroll="'all'")
      map-view
    map-control
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
