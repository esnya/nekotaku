<template lang="pug">
  v-autocomplete(
    required
    name="dice"
    label="ダイスの種類"
    :error-messages="errors.collect('dice')"
    :items="items"
    :menu-props="{ zIndex:10000 }"
    :value="value"
    @input="$emit('input', $event)"
    v-validate="'required'"
  )
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { infoList } from '../utilities/bcdice';

@Component
export default class DiceSelect extends Vue {
  @Prop({ required: false, type: String }) value?: string;

  get items(): { text: string, value: string}[] {
    return [
      { text: '標準ダイスボット', value: 'DiceBot' },
      ...infoList.map(i => ({ text: i.gameName, value: i.gameType })),
    ];
  }
}
</script>

<style lang="stylus">
.dialog
  overflow: initial
</style>
