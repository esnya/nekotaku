<template lang="pug">
  div.room-list-info
    v-chip.pl-0.mr-0.indigo(small)
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
    };
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
</style>
