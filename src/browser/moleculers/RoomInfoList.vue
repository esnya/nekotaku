<template lang="pug">
  div.room-list-info
    room-dice-chip(:dice="room.dice" @click="helpOpen = true")
    room-members-chip(:members="sortedMembers.length" v-if="members" @click="membersOpen = true")
    room-created-at-chip(:createdAt="room.createdAt")
    dice-help-dialog(:dice="room.dice" v-if="members" v-model="helpOpen")
    member-list-dialog(:members="sortedMembers" v-if="members" v-model="membersOpen")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DiceHelpDialog from '@/browser/moleculers/DiceHelpDialog.vue';
import Member from '@/models/Member';
import MemberListDialog from '@/browser/moleculers/MemberListDialog.vue';
import Room from '@/models/Room';
import RoomCreatedAtChip from '@/browser/moleculers/RoomCreatedAtChip.vue';
import RoomDiceChip from '@/browser/atoms/RoomDiceChip.vue';
import RoomMembersChip from '@/browser/atoms/RoomMembersChip.vue';

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
  @Prop() members?: Member[];
  @Prop({ required: true }) room!: Room;

  helpOpen: boolean = false;
  membersOpen: boolean = false;

  get sortedMembers(): Member[] {
    const {
      members,
    } = this;

    return members
      ? members.slice().sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
      : [];
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
