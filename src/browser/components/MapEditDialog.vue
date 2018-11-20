<template lang="pug">
  v-dialog(v-if="map" :value="value", @input="v => $emit('input', v)")
    v-card(v-scroll="'y'")
      v-card-title
        span.headline マップ設定
      v-card-text
        v-text-field(
          label="幅"
          type="number"
          minValue="1"
          :value="map.width"
          @input="update('width', Number($event))"
        )
        v-text-field(
          label="高さ"
          type="number"
          minValue="1"
          :value="map.height"
          @input="update('height', Number($event))"
        )
        .neko-flex-row
          file-input.success(accept="image/*" @input="updateBG") 背景変更
          v-btn.warning(@click="clearBG") 背景クリア
        v-checkbox(
          label="グリッドを非表示"
          :value="Boolean(map.hideGrid)"
          @click="update('hideGrid', !map.hideGrid)"
        )
      v-card-actions
        v-spacer
        v-btn(@click="$emit('input', false)") 閉じる
</template>

<script>
import FileInput from '@/browser/components/FileInput.vue';

export default {
  components: {
    FileInput,
  },
  methods: {
    async update(key, value) {
      await this.$models.map.update(
        this.roomId,
        { [key]: value },
      );
    },
    async updateBG(file) {
      const url = await this.$models.map.pushFile(this.roomId, file);
      await this.update('backgroundImage', url);
    },
    async clearBG() {
      await this.update('backgroundImage', null);
    },
  },
  props: {
    map: {
      required: true,
      type: Object,
    },
    roomId: {
      required: true,
      type: String,
    },
    value: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
