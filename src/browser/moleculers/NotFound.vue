<template lang="pug">
  v-layout(column align-center)
    v-spacer
    .nekokoro(@click="count++")
      transition(name="transition-nekokoro")
        img(v-if="count >= 50", src="/img/nekokoro.svg")
    .shadow
    div.message-container
      transition(name="transition-message")
        div(v-if="count >= 50", key="4") なにもないって言ってるなじゃない。
        div(v-else-if="count >= 20", key="3") なにもないんだよ。
        div(v-else-if="count >= 10", key="2") なにもないってば。
        div(v-else, key="1") ここにはなにもないよ。URLがまちがっていないかな?
    div
      v-btn(color="primary" :to="lobby") もどる
    v-spacer
</template>

<script>
import * as Routes from '../routes';

export default {
  data() {
    return {
      count: 0,
    };
  },
  computed: {
    lobby() {
      return { name: Routes.Lobby.name };
    },
  },
  watch: {
    count(count) {
      if (count === 50) {
        setTimeout(() => {
          this.$router.push(this.lobby);
        }, 2000 + 2000);
      }
    },
  },
};
</script>


<style lang="stylus" scoped>
.layout
  height 100vh

.shadow
  margin 20px
  width 50vw
  height 15vw
  background-color rgba(0, 0, 0, 0.1)
  border-radius 50%
  box-shadow 0 0 10px 10px rgba(0, 0, 0, 0.1)

.nekokoro
  position relative
  width 50vw
  height 50vw
  margin-left -5vw
  margin-bottom -22vw
  overflow hidden

  img
    width 100%
    height 100%

.message-container
  position relative
  margin 20px 0
  width 100%
  height 20px
  text-align center
  overflow: hidden

  > *
    width 100%
    height 100%

.transition-message
  &-enter-active
  &-leave-active
    position absolute
    transition transform 1s ease-in-out, opacity 1s ease-in-out
  &-enter
  &-leave-to
    transform translate(0, 100%)
    opacity 0

.transition-nekokoro
  &-enter-active
  &-leave-active
    transition transform 2s ease-in-out
  &-enter
  &-leave-to
    transform translate(0, 100%)
</style>
