<template lang="pug">
  v-dialog(v-model="open")
    v-btn.primary.add-button(dark, fab, slot="activator")
      v-icon add
    v-card
      v-card-title
        .headline キャラクター追加
      v-card-text
        v-form(v-model="valid", @submit.prevent="submit")
          v-text-field(
            label="名前"
            v-model="name"
            required
          )
          v-text-field(
            label="イニシアチブ"
            type="number"
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
        v-btn(@click.native="open = false") キャンセル
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

      this.open = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
.add-button
  position: absolute;
  right: 16px;
  bottom: 16px;
</style>
