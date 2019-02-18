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

@Component
export default class RoomDiceChip extends Vue {
  @Prop({ required: true }) private dice!: string;

  gameName: string | null = null;

  private async updateGameTitle(): Promise<void> {
    const { getDiceBotDescByFilename } = await import(/* webpackChunkName: "bcdice" */'../utilities/bcdice');
    const desc = getDiceBotDescByFilename(this.dice);
    this.gameName = desc ? desc.gameName : this.dice;
  }

  @Watch('dice')
  private onDiceChanged(): void {
    this.updateGameTitle();
  }

  private created(): void {
    this.updateGameTitle();
  }
}
</script>
