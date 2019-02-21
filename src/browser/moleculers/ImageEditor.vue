<template lang="pug">
  .neko-container
    image-preview(:url="url")
    .neko-button-container.pb-1
      upload-icon-button(accept="image/*" @input="onInput")
      clear-icon-button(color="red" :disabled="!url" @click="$emit('clear', $event)")
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Vue,
} from 'vue-property-decorator';
import ClearIconButton from '@/browser/atoms/ClearIconButton.vue';
import ImagePreview from '@/browser/atoms/ImagePreview.vue';
import UploadIconButton from '@/browser/atoms/UploadIconButton.vue';

@Component({
  components: {
    ClearIconButton,
    ImagePreview,
    UploadIconButton,
  },
})
export default class ImageEditor extends Vue {
  @Prop() url?: string;

  @Emit('upload')
  emitUpload(file: File) {}

  onInput(file: File | null) {
    if (file) this.emitUpload(file);
  }
}
</script>

<style lang="stylus" scoped>
.neko-container
  position relative

.neko-button-container
  position absolute
  bottom 0
  right 0
</style>
