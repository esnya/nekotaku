<template lang="pug">
  v-chip(dark small color="indigo" @click="$emit('click', $event)")
    v-icon mdi-dice-multiple
    span {{gameName || dice}}
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { getInfo, Info } from '../utilities/bcdice';

@Component
export default class RoomDiceChip extends Vue {
  @Prop({ required: true }) private dice!: string;

  get info(): Info | null {
    return getInfo(this.dice) || null;
  }

  get gameName(): string | null {
    return this.info && this.info.gameName;
  }
}
</script>
