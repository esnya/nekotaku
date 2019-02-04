<template lang="pug">
  .neko-container
    image-preview(:url="url")
    .neko-button-container.pb-1
      upload-icon-button(@click="upload")
      clear-icon-button(color="red" :disabled="!url" @click="clear")
</template>

<script>
import ClearIconButton from '@/browser/atoms/ClearIconButton.vue';
import ImagePreview from '@/browser/atoms/ImagePreview.vue';
import UploadIconButton from '@/browser/atoms/UploadIconButton.vue';
import openFile from '@/browser/utilities/file';

export default {
  components: {
    ClearIconButton,
    ImagePreview,
    UploadIconButton,
  },
  methods: {
    async upload() {
      const file = await openFile('image/*');
      if (file) this.$emit('upload', file);
    },
    clear(event) {
      this.$emit('clear', event);
    },
  },
  props: {
    url: {
      required: false,
      type: String,
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-container
  position relative

.neko-button-container
  position absolute
  bottom 0
  right 0
</style>
