<template lang="pug">
  .app
    v-toolbar(dark fixed color="primary")
      img(src="/img/nekokoro32.png")
      v-toolbar-title パスワード入力
    main
      v-container
        form(@submit.prevent="join")
          v-text-field(
            required
            label="パスワード"
            name="password"
            type="password"
            :error-messages="errors.collect('password')"
            v-model="password"
            v-validate="'required'"
          )
          v-layout(row justify-center)
            v-btn(color="primary" @click="join") 参加
            v-btn(@click="cancel") やめる
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Routes from '@/browser/routes';
import PasswordDAO from '@/browser/dao/PasswordDAO';

@Component
export default class RoomPasswordPage extends Vue {
  password: string | null = null;

  async join() {
    const { password } = this;

    if (!await this.$validator.validateAll() || !password) return;

    const passwordDAO = new PasswordDAO();
    await passwordDAO.update({ password });

    this.$router.push({ name: Routes.Room.name, params: { roomId: passwordDAO.roomId } });
  }

  cancel() {
    this.$router.push({ name: Routes.Lobby.name });
  }
}
</script>
