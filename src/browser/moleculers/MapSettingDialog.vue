<template lang="pug">
  simple-dialog(title="マップ設定" :value="value" @input="$emit('input', $event)")
    map-size-input(label="幅" v-model="width")
    map-size-input(label="高さ" v-model="height")
    div 背景
    image-editor(
      :url="map.backgroundImage"
      @clear="clearBackgroundImage"
      @upload="updateBackgroundImage"
    )
    map-grid-checkbox(v-model="grid")
</template>

<script>
import ImageEditor from '@/browser/moleculers/ImageEditor.vue';
import MapGridCheckbox from '@/browser/atoms/MapGridCheckbox.vue';
import MapSizeInput from '@/browser/atoms/MapSizeInput.vue';
import SimpleDialog from '@/browser/moleculers/SimpleDialog.vue';
import roomDAO from '@/browser/dao/roomDAO';

function field(key) {
  return {
    get() {
      return this.map[key];
    },
    set(value) {
      roomDAO.update({ [key]: value });
    },
  };
}

export default {
  components: {
    ImageEditor,
    MapGridCheckbox,
    MapSizeInput,
    SimpleDialog,
  },
  computed: {
    height: field('mapHeight'),
    grid: field('mapGrid'),
    width: field('mapWidth'),
  },
  methods: {
    async clearBackgroundImage() {
      throw new Error('ToDo');
    },
    async updateBackgroundImage(file) {
      throw new Error('ToDo');
    },
  },
  props: {
    map: {
      required: true,
      type: Object,
    },
    value: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
