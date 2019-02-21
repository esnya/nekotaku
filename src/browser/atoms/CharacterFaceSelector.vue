<template lang="pug">
  v-select(
    label="表情"
    :items="faces"
    :value="value"
    @input="$emit('input', $event)"
  )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CharacterFaceSelector extends Vue {
  @Prop({ required: true }) faces!: string[];
  @Prop() value?: string;
}
</script>
