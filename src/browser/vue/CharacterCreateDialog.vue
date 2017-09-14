<template lang="pug">
  v-dialog(:value="value" @input="v => $emit('input', v)")
    v-card(v-scroll="'y'")
      v-card-title
        .headline キャラクター追加
      v-card-text
        v-form(v-model="valid", @submit.prevent="submit")
          v-text-field(
            label="名前"
            v-model="name"
            :rules="[requiredRule]"
            required
          )
        v-form(@submit.prevent="submit")
          v-text-field(
            label="イニシアチブ"
            type="number"
            :rules="[requiredRule]"
            v-model="initiative"
            required
          )
          v-text-field(
            v-if="room"
            v-for="(attr, index) in room.characterAttributes"
            v-model="attributes[index]"
            :key="index"
            :label="attr"
          )
      v-card-actions
        v-spacer
        v-btn.primary(:disabled="!valid",@click="submit") 作成
        v-btn(@click.native="close()") キャンセル
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: mapState([
    'room',
  ]),
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
    ...mapActions([
      'createCharacter',
    ]),
    requiredRule(v) {
      return v ? true : '入力して下さい。';
    },
    submit() {
      const {
        name,
        initiative,
        attributes,
      } = this;

      this.createCharacter({
        name,
        initiative,
        attributes: [...attributes],
      });

      this.close();
    },
    close() {
      this.$emit('input', false);
    },
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
