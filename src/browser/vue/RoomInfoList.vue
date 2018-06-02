<template lang="pug">
  div.room-list-info
    v-dialog(v-model="helpOpen" width="auto")
      v-card(v-scroll="'y'")
        v-card-title
          span.headline {{dice}}
        v-card-text.neko-scroll
          .line(v-for="(line, i) in helpMessage", :key="i") {{line}}
        v-card-actions
          v-spacer
          v-btn(@click="helpOpen = false") 閉じる
    v-chip.pl-0.mr-0.indigo(small @click="helpOpen = true")
      v-icon.mx-1(dark) mdi-dice-multiple
      span.white--text {{dice || room.dice}}
    v-chip.pl-0.mr-0.green(small)
      v-icon.mx-1(dark) mdi-account-multiple
      span.white--text {{room.players}}
    v-chip.pl-0.mr-0.orange(small)
      v-icon.mx-1(dark) mdi-clock
      span.white--text {{time}}
    //- v-chip.pl-0.orange(small)
    //-   v-icon.mx-1(dark) mdi-binoculars
    //-   span.white--text  {{room.visitors}}
</template>

<script>
import moment from 'moment';
import { getHelpMessage, getDiceBotDescByFilename } from '../utilities/bcdice';

export default {
  computed: {
    time() {
      return moment(this.room.createdAt).format('lll');
    },
    dice() {
      const desc = getDiceBotDescByFilename(this.room.dice);
      return desc ? desc.gameName : this.room.dice;
    },
  },
  data() {
    return {
      helpOpen: false,
      helpMessage: [],
    };
  },
  watch: {
    async helpOpen(helpOpen) {
      if (helpOpen) {
        this.helpMessage = (await getHelpMessage(this.room.dice)).split(/\n/g);
      }
    },
  },
  props: [
    'room',
  ],
};
</script>

<style lang="stylus" scoped>
.room-list-info
  display flex
  flex-wrap nowrap
  overflow-x auto
  -webkit-overflow-scrolling touch

.line
  white-space nowrap
</style>
