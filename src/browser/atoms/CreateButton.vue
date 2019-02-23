<template lang="pug">
  v-btn(color="primary" :disabled="loading" @click="$emit('click', $event)")
    v-progress-circular.primary--text(indeterminate v-if="loading")
    span(v-else) 作成
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CreateButton extends Vue {
  @Prop() loading?: boolean;
}
</script>
