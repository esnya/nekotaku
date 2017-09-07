<template lang="pug">
  v-dialog(v-model="open")
    v-btn(icon, slot="activator")
      v-icon edit
    v-card
      v-card-title
        .headline {{character.name}}
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
            :value="attributes[index]"
            :key="index"
            :label="attr"
            @input="value => updateAttribute(index, value)"
          )
      v-card-actions
        v-spacer
        v-dialog(v-model="rdOpen")
          v-btn.red.mr-0(dark, slot="activator", @click="open = false") 削除
          v-card
            v-card-title
              .headline {{character.name}}の削除
            v-card-text {{character.name}}を削除しますか？
            v-card-actions
              v-spacer
                v-btn.red(dark, @click="() => { rdOpen = false; removeCharacter(character.id); }") 削除
                v-btn(@click="rdOpen = false") キャンセル
      v-card-actions
        v-spacer
        v-btn(@click="open = false") 閉じる
</template>

<script>
import { mapActions, mapState } from 'vuex';

function inputValue(key) {
  return {
    get() {
      return this.character[key];
    },
    set(value) {
      this.updateCharacter({
        id: this.character.id,
        key,
        value,
      });
    },
  };
}

export default {
  computed: {
    ...mapState([
      'room',
    ]),
    name: inputValue('name'),
    initiative: inputValue('initiative'),
    attributes: inputValue('attributes'),
  },
  data() {
    return {
      open: false,
      rdOpen: false,
      valid: true,
    };
  },
  methods: {
    ...mapActions([
      'updateCharacter',
      'removeCharacter',
    ]),
    updateAttribute(index, newValue) {
      if ((typeof newValue) !== 'string') return;

      const attributes = this.attributes.slice();
      attributes[index] = newValue;

      this.updateCharacter({
        id: this.character.id,
        key: 'attributes',
        value: attributes,
      });
    },
  },
  props: [
    'character',
    'value',
    'onRequestClose',
  ],
};
</script>

<style lang="stylus" scoped>
</style>
