<template lang="pug">
  div.room-list-info
    v-dialog(v-model="helpOpen", width="auto")
      v-card(v-scroll="'y'")
        v-card-title
          span.headline {{dice}}
        v-card-text.neko-scroll
          .line(v-for="(line, i) in helpMessage", :key="i") {{line}}
        v-card-actions
          v-spacer
          v-btn(@click="helpOpen = false") 閉じる
    v-chip.pl-0.mr-0.indigo(small, @click.stop="getHelpMessage")
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

export default {
  computed: {
    time() {
      return moment(this.room.createdAt).format('lll');
    },
  },
  data() {
    return {
      dice: null,
      helpMessage: null,
      helpOpen: false,
    };
  },
  methods: {
    async getHelpMessage() {
      if (!this.room) {
        this.tooltip = null;
      } else {
        const {
          getHelpMessage,
        } = await import('../utilities/bcdice');

        const helpMessage = await getHelpMessage(this.room.dice);
        this.helpMessage = helpMessage.split(/\n/g);
        this.helpOpen = true;
      }
    },
  },
  props: [
    'room',
  ],
  watch: {
    room({ dice }, { dice: prevDice }) {
      if (dice === prevDice) return;

      import('../utilities/bcdice').then(({ getDiceBotDescByFilename }) => {
        const desc = getDiceBotDescByFilename(this.room.dice);
        this.dice = desc ? desc.gameType : dice;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.room-list-info
  display: flex;
  flex-wrap: wrap;

.line
  white-space nowrap
</style>
