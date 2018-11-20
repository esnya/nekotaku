<template lang="pug">
  div
    iframe.taspd(
      :src="room.taspdUrl"
      v-if="isValidUrl"
    )
    v-dialog(:value="value" @input="$emit('input', $event)")
      v-card
        v-card-title
          span.headline TabletopAudio連携
        v-card-text
          v-text-field(
            label="SoundPad BroadCast URL"
            hint="https://tabletopaudio.com/xxxx.html?jointabletopgameid=xxxxxx"
            :value="room.taspdUrl"
            @input="onInput"
          )
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="$emit('input', false)") 閉じる
</template>

<style lang="stylus" scoped>
.taspd
  position fixed
  max-width 0
  max-height 0
</style>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'room',
    ]),
    isValidUrl() {
      return this.room && this.room.taspdUrl && this.room.taspdUrl.match(/https:\/\/tabletopaudio\.com\/[a-z0-9_]+\.html\?jointabletopgameid=[0-9]+$/);
    },
  },
  methods: {
    ...mapActions([
      'updateRoom',
    ]),
    onInput(value) {
      this.updateRoom({ key: 'taspdUrl', value });
    },
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
