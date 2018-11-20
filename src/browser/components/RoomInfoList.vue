<template lang="pug">
  div.room-list-info
    v-chip.pl-0.mr-0.indigo(small @click="helpOpen = true")
      v-icon.mx-1(color="white") mdi-dice-multiple
      span.white--text {{dice || room.dice}}
    v-chip.pl-0.mr-0.green(small v-if="members" @click="membersOpen = true")
      v-icon.mx-1(color="white") mdi-account-multiple
      span.white--text {{memberList.length}}
    v-chip.pl-0.mr-0.orange(small)
      v-icon.mx-1(color="white") mdi-clock
      span.white--text {{time}}
    v-dialog(v-model="helpOpen" width="auto")
      v-card(v-scroll="'y'")
        v-card-title
          span.headline {{dice}}
        v-card-text.neko-scroll
          .line(v-for="(line, i) in helpMessage", :key="i") {{line}}
        v-card-actions
          v-spacer
          v-btn(@click="helpOpen = false") 閉じる
    v-dialog(v-if="members" v-model="membersOpen" width="auto")
      v-card(v-scroll="'y'")
        v-card-title
          span.headline メンバー
        v-list
          v-list-tile(
            avatar
            :key="member.uid"
            v-for="member in memberList"
          )
            v-list-tile-action
              v-icon(
                color="success"
                v-if="(Date.now() - member.timestamp) <= 60 * 1000"
              ) mdi-account
              v-icon(v-else) mdi-account-outline
            v-list-tile-content
              v-list-tile-title
                span(:style="{ color: member.color }") {{member.name}}
        v-card-actions
          v-spacer
          v-btn(@click="membersOpen = false") 閉じる
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

export default {
  computed: {
    time() {
      return moment(this.room.createdAt).format('lll');
    },
    memberList() {
      return this.members && _(this.members)
        .filter(v => (typeof v === 'object'))
        .map((value, uid) => ({ ...value, uid }))
        .sortBy(['timestamp'])
        .reverse()
        .value();
    },
  },
  data() {
    return {
      helpOpen: false,
      helpMessage: [],
      membersOpen: false,
      dice: '',
    };
  },
  watch: {
    async helpOpen(helpOpen) {
      if (helpOpen) {
        const { getHelpMessage } = await import(/* webpackChunkName: "bcdice" */'../utilities/bcdice');
        this.helpMessage = (await getHelpMessage(this.room.dice)).split(/\n/g);
      }
    },
    room(room) {
      this.updateDice(room);
    },
  },
  methods: {
    async updateDice(room) {
      const { getDiceBotDescByFilename } = await import(/* webpackChunkName: "bcdice" */'../utilities/bcdice');
      const desc = getDiceBotDescByFilename(room.dice);
      this.dice = desc ? desc.gameName : room.dice;
    },
  },
  created() {
    this.updateDice(this.room);
  },
  props: {
    members: {
      default: null,
      required: false,
      type: Object,
    },
    room: {
      required: true,
      type: Object,
    },
  },
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
