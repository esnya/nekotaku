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
import { getInfo, Info } from '../utilities/bcdice';

@Component({
  components: {
    SimpleDialog,
  },
})
export default class DiceHelpDialog extends Vue {
  @Prop({ required: true }) private dice!: string;
  @Prop({ required: true }) private value!: boolean;

  get info(): Info | null {
    return getInfo(this.dice) || null;
  }

  get gameName(): string | null {
    return this.info ? this.info.gameName : this.dice;
  }

  get lines(): string[] {
    return this.info ? this.info.info.split(/\n/g) : [];
  }
}
</script>
