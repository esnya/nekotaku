<template lang="pug">
  v-text-field(
    required
    label="アイコンサイズ"
    name="character-icon-size"
    type="number"
    :error-messages="errors.collect('character-icon-size')"
    :value="`${value}`"
    v-validate="'required|numeric'"
    @change="onInput"
  )
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Vue,
} from 'vue-property-decorator';

@Component
export default class CharacterIconSizeInput extends Vue {
  @Prop() value?: number;

  @Emit('input')
  emitInput(value: number | null) {}

  onInput(value?: string) {
    const number = Number(value);
    this.emitInput(Number.isNaN(number) ? null : number);
  }
}
</script>
