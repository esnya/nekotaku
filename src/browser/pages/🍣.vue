<template lang="pug">
  .neko-app
    v-toolbar(dark fixed color="primary")
      div 🍣
    main
      v-container
        span.sushi(
          :key="i"
          :style="{ animationDelay: `${sushi.delay}s`, fontSize: `${sushi.size}em` }"
          v-for="(sushi, i) in sushis"
        ) 🍣
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

interface Sushi {
  delay: number;
  size: number;
}

@Component
export default class SushiPage extends Vue {
  sushis: Sushi[] = [];

  addSushi(): void {
    this.sushis.push({
      delay: Math.random() * 4,
      size: 1 + Math.random() * 4,
    });
  }

  private timer?: any;
  created() {
    this.timer = setInterval(() => {
      this.addSushi();
    }, 1000);
  }

  destroyed() {
    if (this.timer) clearInterval(this.timer);
  }
}
</script>

<style lang="stylus" scoped>
.sushi {
  position relative
  animation-name sushi
  animation-duration 4s
  animation-iteration-count infinite
  animation-timing-function linear
}

@keyframes sushi {
  0% {
    top -150vh
  }
  100% {
    top 150vh
  }
}
</style>
