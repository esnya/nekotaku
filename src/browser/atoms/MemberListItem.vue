<template lang="pug">
  v-list-tile(avatar)
    v-list-tile-action
      v-icon(
        color="success"
        v-if="isOnline"
      ) mdi-account
      v-icon(v-else) mdi-account-outline
    v-list-tile-content
      v-list-tile-title
        span(:style="{ color: member.color }") {{member.name}}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Member from '@/models/Member';

@Component
export default class MemberListItem extends Vue {
  @Prop({ required: true }) private member!: Member;

  private isOnline(): boolean {
    return (Date.now() - this.member.updatedAt.getTime()) <= 60 * 1000;
  }
}
</script>
