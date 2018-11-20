<template lang="pug">
  v-dialog(v-model="open")
    v-btn(icon, slot="activator")
      v-icon edit
    v-card(v-scroll="'y'")
      v-card-title
        span.headline {{character.name}}
      v-divider
      v-tabs(
        centered
        icons-and-text
        light
        v-model="tab"
      )
        v-tab
          div 基本データ
          v-icon format_list_bulleted
        v-tab
          div アイコン
          v-icon portrait
        v-tab
          div 立ち絵
          v-icon person
        v-tab
          div.error--text 削除
          v-icon(error) delete
        v-divider
        v-tab-item
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
                :key="index"
                :label="attr"
                :value="attributes && attributes[index]"
                v-if="room && room.characterAttributes"
                v-for="(attr, index) in room.characterAttributes"
                @input="value => updateAttribute(index, value)"
              )
        v-tab-item
          v-img(
            :src="character.icon"
            v-if="character.icon"
          )
          v-card-actions
            v-spacer
            file-input.success(@input="updateIcon")
              span(v-if="character.icon") 変更
              span(v-else) 登録
            v-btn.warning(@click="clearIcon") クリア
            v-spacer
          v-card-text
            v-text-field(
              label="アイコンサイズ"
              type="number"
              v-model="iconSize"
            )
            v-checkbox(
              label="マップに表示しない"
              v-model="hideIcon"
            )
        v-tab-item
          v-card-text
            v-layout(row align-center)
              v-flex
                v-select(
                  full-width
                  hide-details
                  label="表情"
                  :items="faces"
                  v-model="face"
                )
              character-face-append-dialog(@input="appendFace")
              remove-confirmation-dialog(:disabled="face === 'default'" @remove="removeFace")
          v-img(
            :src="character.portrait[face].url"
            v-if="character.portrait && character.portrait[face]"
          )
          v-card-actions
            v-spacer
            file-input.success(@input="updatePortrait(face, $event)")
              span(v-if="character.portrait && character.portrait[face]") 変更
              span(v-else) 登録
            v-btn.warning(@click="clearPortrait({ id, key: face })") クリア
            v-spacer
        v-tab-item
          v-card-text.text-xs-center {{character.name}}を削除しますか？
          v-card-actions
            v-spacer
            v-btn(color="error" @click="remove") 削除
            v-spacer
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="open = false") 閉じる
</template>

<script>
import CharacterFaceAppendDialog from '@/browser/components/CharacterFaceAppendDialog.vue';
import RemoveConfirmationDialog from '@/browser/components/RemoveConfirmationDialog.vue';
import FileInput from '@/browser/components/FileInput.vue';

function inputValue(key, defaultValue) {
  return {
    get() {
      return this.character[key] || defaultValue;
    },
    set(value) {
      this.$models.characters.update(this.roomId, this.characterId, { [key]: value });
    },
  };
}

function filterFaces(faces) {
  return faces.indexOf('default') < 0 ? ['default', ...faces] : faces;
}

export default {
  components: {
    RemoveConfirmationDialog,
    CharacterFaceAppendDialog,
    FileInput,
  },
  computed: {
    id() {
      return this.character.id;
    },
    characterId() {
      return this.character.id;
    },
    roomId() {
      return this.room.id;
    },
    attributes: inputValue('attributes'),
    hideIcon: inputValue('hideIcon'),
    iconSize: inputValue('iconSize', 1),
    initiative: inputValue('initiative'),
    name: inputValue('name'),
  },
  data() {
    const faces = Object.keys(this.character.portrait || {});
    return {
      open: false,
      rdOpen: false,
      tab: 0,
      face: 'default',
      faces: filterFaces(faces),
    };
  },
  methods: {
    updateAttribute(index, newValue) {
      if ((typeof newValue) !== 'string') return;

      const attributes = (this.attributes || []).slice();
      attributes[index] = newValue;

      this.$models.characters.update(
        this.roomId,
        this.characterId,
        { attributes },
      );
    },
    async updateIcon(file) {
      const url = await this.$models.characters.pushFile(this.roomId, file);
      this.$models.characters.update(
        this.roomId,
        this.characterId,
        { icon: url },
      );
    },
    async updatePortralt(face, file) {
      const url = await this.$models.characters.pushFile(this.roomId, file);
      this.$models.characters.update(
        this.roomId,
        `${this.characterId}/${face}`,
        { url },
      );
    },
    appendFace(face) {
      this.faces.push(face);
      this.face = face;
    },
    async clearIcon() {
      await this.$models.characters.update(
        this.roomId,
        this.characterId,
        { icon: null },
      );
    },
    async removeFace() {
      const { face } = this;

      await this.$models.characters.update(
        this.roomId,
        `${this.characterId}/${face}`,
        null,
      );

      this.faces = filterFaces(this.faces.filter(f => f !== face));
      this.face = 'default';
    },
    async remove() {
      this.$emit('input', false);
      await this.$models.characters.remove(this.roomId, this.characterId);
    },
  },
  watch: {
    character(character) {
      Object.keys(character.portrait).forEach((key) => {
        if (this.faces.indexOf(key) < 0) this.faces.push(key);
      });
    },
  },
  props: {
    character: {
      required: true,
      type: Object,
    },
    room: {
      required: true,
      type: Object,
    },
  },
};
</script>
