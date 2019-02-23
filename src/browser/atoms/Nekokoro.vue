<template lang="pug">
  img(:src="`/img/nekokoro${size}.png`")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Nekokoro extends Vue {
  @Prop() size: number = 32;
}
</script>
