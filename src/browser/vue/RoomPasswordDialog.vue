<template lang="pug">
  v-dialog(
    fullscreen
    :hide-overlay="true"
    :value="open"
  )
    v-card
      v-toolbar.primary(dark)
        v-btn(icon, dark, @click="leave")
          v-icon keyboard_backspace
        v-toolbar-title {{title}}
        v-spacer
      v-container
        v-text-field(
          required
          label="パスワード"
          type="password"
          :rules="[passwordRule]"
          :value="password"
          @input="password => setJoinRoomPassword({ id, password })"
        )
        v-layout(row)
          v-spacer
          v-btn(primary, @click="joinRoom({ id, route: $route })") 参加
          v-btn(@click="leave") やめる
          v-spacer
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import * as RouteNames from '../constants/route';

export default {
  computed: {
    ...mapState([
      'room',
      'roomJoinInfo',
    ]),
    id() {
      return this.room && this.room.id;
    },
    title() {
      return this.room && this.room.title;
    },
    password() {
      return this.roomJoinInfo[this.id] && this.roomJoinInfo[this.id].password;
    },
    passwordRule() {
      if (!this.room) return true;

      return this.room.passwordIncorrect ? 'パスワードが間違っています。' : true;
    },
    open() {
      return (this.room && this.room.locked) || false;
    },
  },
  methods: {
    ...mapActions([
      'joinRoom',
      'leaveRoom',
    ]),
    ...mapMutations([
      'setJoinRoomPassword',
    ]),
    leave() {
      this.leaveRoom();
      this.$router.push({ name: RouteNames.Lobby });
    },
  },
};
</script>

<style lang="stylus" scoped>
.toolbar__side-icon .btn__content:before
  background-color transparent
</style>
