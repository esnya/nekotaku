<template lang="pug">
  v-select(
    hide-details
    chips
    multiple
    label="秘話設定"
    :items="items"
    :value="value"
    @input="$emit('input', $event)"
  )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Member from '@/models/Member';

@Component
export default class WhisperTargetSelect extends Vue {
  @Prop() value: string[] | null = null;
  @Prop({ required: true }) members!: Member[];

  get items(): string[] {
    return this.members.map(member => member.name);
  }
}
</script>
