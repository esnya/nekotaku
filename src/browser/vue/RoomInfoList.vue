<template lang="pug">
  div.room-list-info
    v-dialog(v-model="helpOpen", width="auto")
      v-card
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
    v-chip.pl-0.mr-0.light-blue(small)
      v-icon.mx-1(dark) mdi-account-multiple
      span.white--text  {{room.players}}
    //- v-chip.pl-0.green(small)
    //-   v-icon.mx-1(dark) mdi-binoculars
    //-   span.white--text  {{room.visitors}}
</template>

<script>
export default {
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
  created() {
    import('../utilities/bcdice').then(({ getDiceBotDescByFilename }) => {
      const desc = getDiceBotDescByFilename(this.room.dice);
      if (desc) this.dice = desc.gameType;
    });
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
