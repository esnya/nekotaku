<template lang="pug">
  .neko-flex-container(v-if="room")
    room-title-bar
    .neko-floating
      room-info-list.room-info-list(:room="room")
    .neko-flex
      .slide(:style="slideStyle")
          chat-tab
          character-list
          map-tab
    v-bottom-nav.white(
      :active.sync="roomTab"
      :class="{ 'neko-flat': roomTab !== '1' }"
      :value="true"
    )
      v-btn(flat, primary, value="0")
        span チャット
        v-icon mdi-forum
      v-btn(flat, primary, value="1")
        span キャラクター
        v-icon mdi-account-multiple
      v-btn(flat, primary, value="2")
        span マップ
        v-icon mdi-map-marker-radius
  loading(v-else)
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ChatTab from './ChatTab.vue';
import CharacterList from './CharacterList.vue';
import Loading from './Loading.vue';
import MapTab from './MapTab.vue';
import RoomInfoList from './RoomInfoList.vue';
import RoomTitleBar from './RoomTitleBar.vue';

export default {
  components: {
    ChatTab,
    CharacterList,
    Loading,
    MapTab,
    RoomInfoList,
    RoomTitleBar,
  },
  data() {
    return {
      roomTab: '0',
    };
  },
  computed: {
    ...mapState([
      'room',
    ]),
    slideStyle() {
      return {
        transform: `translate(-${this.roomTab}00%, 0)`,
      };
    },
  },
  methods: mapActions([
    'joinRoom',
    'leaveRoom',
  ]),
  mounted() {
    const {
      id,
    } = this.$route.params;

    this.joinRoom({ id, router: this.$router });
  },
  beforeDestroy() {
    this.leaveRoom();
  },
};
</script>

<style lang="stylus" scoped>
.slide
  height 100%
  display flex
  transition transform 0.4s ease-in-out

  > *
    flex 0 0 100%
    overflow hidden

.neko-flat
  box-shadow none
</style>
