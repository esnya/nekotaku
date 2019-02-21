<template lang="pug">
  v-select(:items="items" :value="value" @input="$emit('input', $event)")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ChatFaceSelect extends Vue {
  @Prop({ required: true }) faces!: string[];
  @Prop() value?: string;

  get items(): string[] {
    const {
      faces,
    } = this;

    if (faces.length === 0) return ['default'];
    return faces;
  }
}
</script>
