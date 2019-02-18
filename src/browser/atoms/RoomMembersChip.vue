<template lang="pug">
  v-chip(color="green" dark small @click="$emit('click', $event)")
    v-icon mdi-account-multiple
    span {{members}}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class RoomMembersChip extends Vue {
  @Prop({ required: true }) private members!: number;
}
</script>
