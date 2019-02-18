<template lang="pug">
  v-chip(dark small color="orange")
    v-icon mdi-clock
    from-now(:time="createdAt")
</template>

<script lang="ts">
import FromNow from '@/browser/atoms/FromNow.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    FromNow,
  },
})
export default class RoomCreatedAtChip extends Vue {
  @Prop()
  private createdAt!: number;
}
</script>
