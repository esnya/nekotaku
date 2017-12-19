<template lang="pug">
  v-dialog(v-model="open")
    v-btn(icon, slot="activator")
      v-icon edit
    v-card(v-scroll="'y'")
      v-card-title
        span.headline {{character.name}}
      v-divider
      v-tabs(centered, icons, light, v-model="tab")
        v-tabs-bar.white
          v-tabs-slider.primary
          v-tabs-item(href="#basis")
            v-icon format_list_bulleted
            div 基本データ
          v-tabs-item(href="#icon")
            v-icon portrait
            div アイコン
          v-tabs-item(href="#portrait")
            v-icon person
            div 立ち絵
          v-tabs-item(href="#remove")
            v-icon(error) delete
            div.error--text 削除
        v-divider
        v-tabs-items
          v-tabs-content(id="basis")
            v-card-text
              form(@submit.prevent="submit")
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
                  v-if="room && room.characterAttributes"
                  v-for="(attr, index) in room.characterAttributes"
                  :value="attributes && attributes[index]"
                  :key="index"
                  :label="attr"
                  @input="value => updateAttribute(index, value)"
                )
          v-tabs-content(id="icon")
            v-card-title
              span.headline アイコン
            v-card-media(v-if="character.icon")
              div
                img(:src="character.icon")
            v-card-actions
              v-spacer
              file-input.success(@input="file => updateCharacterIcon({ id, file })")
                span(v-if="character.icon") 変更
                span(v-else) 登録
              v-btn.warning(@click="clearCharacterIcon(id)") クリア
              v-spacer
          v-tabs-content(id="portrait")
            v-card-title
              span.headline 立ち絵
            v-card-media(v-if="character.portrait && character.portrait.default")
              div
                img(:src="character.portrait && character.portrait.default && character.portrait.default.url")
            v-card-actions
              v-spacer
              file-input.success(@input="file => updateCharacterPortrait({ id, key: 'default', file })")
                span(v-if="character.portrait && character.portrait.default") 変更
                span(v-else) 登録
              v-btn.warning(@click="clearCharacterPortrait({ id, key: 'default' })") クリア
              v-spacer
          v-tabs-content(id="remove")
            v-card-text.text-xs-center {{character.name}}を削除しますか？
            v-card-actions
              v-spacer
              v-btn(color="error" @click="() => { open = false; removeCharacter(character.id); }") 削除
              v-spacer
        v-divider
        v-card-actions
          v-spacer
          v-btn(@click="open = false") 閉じる
</template>

<script>
import { mapActions, mapState } from 'vuex';
import FileInput from './FileInput.vue';

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
  components: {
    FileInput,
  },
  computed: {
    ...mapState([
      'room',
    ]),
    id() {
      return this.character.id;
    },
    name: inputValue('name'),
    initiative: inputValue('initiative'),
    attributes: inputValue('attributes'),
  },
  data() {
    return {
      open: false,
      rdOpen: false,
      tab: 'basis',
    };
  },
  methods: {
    ...mapActions([
      'clearCharacterIcon',
      'clearCharacterPortrait',
      'updateCharacter',
      'updateCharacterIcon',
      'updateCharacterPortrait',
      'removeCharacter',
    ]),
    updateAttribute(index, newValue) {
      if ((typeof newValue) !== 'string') return;

      const attributes = (this.attributes || []).slice();
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
