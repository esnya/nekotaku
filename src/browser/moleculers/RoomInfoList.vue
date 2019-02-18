<template lang="pug">
  div.room-list-info
    room-dice-chip(:dice="room.dice" @click="helpOpen = true")
    room-members-chip(:members="memberList.length" v-if="members" @click="membersOpen = true")
    room-created-at-chip(:createdAt="room.createdAt")
    dice-help-dialog(:dice="room.dice" v-if="members" v-model="helpOpen")
    member-list-dialog(:members="memberList" v-if="members" v-model="membersOpen")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import values from 'lodash/values';
import DiceHelpDialog from '@/browser/moleculers/DiceHelpDialog.vue';
import MemberListDialog from '@/browser/moleculers/MemberListDialog.vue';
import RoomCreatedAtChip from '@/browser/moleculers/RoomCreatedAtChip.vue';
import RoomDiceChip from '@/browser/atoms/RoomDiceChip.vue';
import RoomMembersChip from '@/browser/atoms/RoomMembersChip.vue';
import Members from '@/types/data/Members';
import Member from '@/types/data/Member';
import Room from '@/types/data/Room';

@Component({
  components: {
    DiceHelpDialog,
    MemberListDialog,
    RoomCreatedAtChip,
    RoomDiceChip,
    RoomMembersChip,
  },
})
export default class RoomInfoList extends Vue {
  @Prop() members?: Members;
  @Prop({ required: true }) room!: Room;

  helpOpen: boolean = false;
  membersOpen: boolean = false;

  get memberList(): Member[] {
    const {
      members,
    } = this;

    return members ? Object.keys(members)
      .filter(key => (typeof members[key] === 'object'))
      .map(key => ({ ...members[key], uid: key }))
      .sort((a, b) => a.updatedAt - b.updatedAt) : [];
  }
}
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
