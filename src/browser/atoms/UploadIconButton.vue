<template lang="pug">
  v-tooltip
    v-btn(
      icon
      slot="activator"
      color="blue"
      :disabled="disabled"
      @click="onClick"
    )
      v-icon(color="white") cloud_upload
    span アップロード
    input(ref="input" type="file" :accept="accept" @change="onInput" v-show="false")
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Vue,
} from 'vue-property-decorator';

@Component
export default class UploadIconButton extends Vue {
  @Prop() accept?: string;
  @Prop() disabled?: boolean;

  @Emit('input')
  emitInput(file: File | null) {}

  get inputElement(): HTMLInputElement {
    return this.$refs.input as HTMLInputElement;
  }

  onClick() {
    this.inputElement.dispatchEvent(new MouseEvent('click'));
  }

  onInput() {
    const { files } = this.inputElement;
    if (!files) return this.emitInput(null);

    const file = files[0];
    return this.emitInput(file || null);
  }
}
</script>
