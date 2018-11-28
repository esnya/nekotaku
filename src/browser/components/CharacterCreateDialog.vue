<template lang="pug">
  v-dialog(
    :value="value"
    v-if="room"
    @input="v => $emit('input', v)"
  )
    v-card(v-scroll="'y'")
      v-card-title
        .headline キャラクター追加
      v-card-text
        form(@submit.prevent="submit")
          v-text-field(
            required
            label="名前"
            name="name"
            :error-messages="errors.collect('name')"
            v-model="name"
            v-validate="'required'"
          )
        v-form(@submit.prevent="submit")
          v-text-field(
            label="イニシアチブ"
            type="number"
            name="initiative"
            :error-messages="errors.collect('initiative')"
            v-model="initiative"
            v-validate="'required|numeric'"
          )
          v-text-field(
            :key="index"
            :label="attr"
            v-for="(attr, index) in room.characterAttributes"
            v-model="attributes[index]"
          )
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="submit") 作成
        v-btn(@click.native="close()") キャンセル
</template>

<script>
import { bindAsObject } from '@/browser/models';

export default {
  mixins: [
    bindAsObject('room'),
  ],
  data() {
    return {
      open: false,
      valid: false,
      name: null,
      initiative: 0,
      attributes: [],
    };
  },
  methods: {
    async submit() {
      if (!await this.$validator.validateAll()) return;

      const {
        name,
        initiative,
        attributes,
      } = this;

      this.$models.characters.push(
        this.room.id,
        {
          x: 0.5,
          y: 0.5,
          z: Date.now(),
          name,
          initiative,
          attributes: [...attributes],
        },
      );

      this.close();
    },
    close() {
      this.$emit('input', false);
    },
  },
  props: {
    value: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
