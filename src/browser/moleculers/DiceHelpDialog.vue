<template lang="pug">
  simple-dialog(:title="gameName || dice" :value="value" @input="$emit('input', $event)")
    div(:key="i" v-for="(line, i) in lines") {{line}}
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import SimpleDialog from './SimpleDialog.vue';

@Component({
  components: {
    SimpleDialog,
  },
})
export default class DiceHelpDialog extends Vue {
  @Prop({ required: true }) private dice!: string;
  @Prop({ required: true }) private value!: boolean;

  gameName: string | null = null;
  helpMessage: string | null = null;

  get lines(): string[] {
    const {
      helpMessage,
    } = this;
    if (!helpMessage) return [];

    return helpMessage.split(/\n/g);
  }

  private async updateDice(): Promise<void> {
    const { getDiceBotDescByFilename, getHelpMessage } = await import(/* webpackChunkName: "bcdice" */'../utilities/bcdice');
    const desc = getDiceBotDescByFilename(this.dice);
    this.gameName = desc ? desc.gameName : this.dice;

    this.helpMessage = await getHelpMessage(this.dice);
  }

  @Watch('dice')
  private onDiceChanged() {
    this.updateDice();
  }

  private created() {
    this.updateDice();
  }
}
</script>
