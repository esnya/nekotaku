<template lang="pug">
  simple-dialog(title="卓メンバー" :value="value" @input="$emit('input', $event)")
    v-list
      member-list-item(:key="member.uid" :member="member" v-for="member in members")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Member from '@/models/Member';
import MemberListItem from '@/browser/atoms/MemberListItem.vue';
import SimpleDialog from '@/browser/moleculers/SimpleDialog.vue';

@Component({
  components: {
    MemberListItem,
    SimpleDialog,
  },
})
export default class MemberListDialog extends Vue {
  @Prop({ required: true }) private members!: Member[];
  @Prop({ required: true }) private value!: boolean;
}
</script>
