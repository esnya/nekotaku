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

<script>
import * as RouteNames from '@/browser/constants/route';

export default {
  data: () => ({
    password: null,
  }),
  methods: {
    async join() {
      if (!await this.$validator.validateAll()) return;

      const { password, roomId } = this;

      await this.$models.passwords.update(roomId, password);
      this.$router.push({ name: RouteNames.Room, params: { roomId } });
    },
    cancel() {
      this.$router.push({ name: RouteNames.Lobby });
    },
  },
};
</script>
