<template lang="pug">
  v-dialog(v-model="value")
    v-btn(
      fab
      fixed
      bottom right
      color="primary"
      slot="activator"
    )
      v-icon add
    v-card(v-scroll="'y'")
      v-card-title.headline 卓作成
      v-card-text
        form(@submit.prevent="submit")
          v-text-field(
            required
            label="タイトル"
            name="title"
            :error-messages="errors.collect('title')"
            v-model="title"
            v-validate="'required'"
          )
          dice-select(
            v-model="dice"
          )
        form(@submit.prevent="submit")
          v-text-field(
            label="パスワード"
            name="password"
            placeholder="空欄で公開卓"
            type="password"
            :error-messages="errors.collect('password')"
            v-model="password"
          )
          transition(name="neko-field")
            v-text-field(
              required
              name="passwordConfirm"
              label="パスワード確認"
              type="password"
              :error-messages="errors.collect('passwordConfirm')"
              v-if="password"
              v-model="passwordConfirm"
              v-validate="{ required: true, is: password }"
            )
          v-text-field(
            name="characterAttributes"
            label="キャラクター属性"
            placeholder="例: HP,MP,SP"
            :error-messages="errors.collect('characterAttributes')"
            v-model="characterAttributesString"
          )
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="submit") 作成
        v-btn(@click.native="value = false") キャンセル
</template>

<script>
import DiceSelect from '@/browser/atoms/DiceSelect.vue';
import * as RouteNames from '@/browser/constants/route';
import run from '@/browser/utilities/task';

export default {
  components: {
    DiceSelect,
  },
  computed: {
    characterAttributesString: {
      get() {
        return this.characterAttributes.join(',');
      },
      set(value) {
        this.characterAttributes = value ? value.split(/\s*,\s*/g) : [];
      },
    },
  },
  data() {
    return {
      value: false,
      title: null,
      dice: null,
      characterAttributes: [],
      password: null,
      passwordConfirm: null,
    };
  },
  methods: {
    submit() {
      run(async () => {
        if (!await this.$validator.validateAll()) return;

        const {
          title,
          dice,
          characterAttributes,
          password,
        } = this;

        if (!title || !dice) return;

        const roomId = await this.$models.rooms.push({
          title,
          dice,
          characterAttributes,
          password,
        });

        this.value = false;

        this.$router.push({ name: RouteNames.Room, params: { roomId } });
      });
    },
  },
};
</script>
