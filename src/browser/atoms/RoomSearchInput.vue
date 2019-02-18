<template lang="pug">
  v-text-field(
    append-icon="search"
    :value="value"
    @change="$emit('input', $event)"
  )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class RoomSearchInput extends Vue {
  @Prop() value?: string | null;
}
</script>
