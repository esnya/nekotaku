<template lang="pug">
  v-card
    v-card-title(v-if="memo.title")
      span.headline {{memo.title}}
    v-card-text(v-if="front")
      p(v-for="line in front") {{line}}
    v-card-text(v-if="back && open")
      p(v-for="line in back") {{line}}
    v-card-actions
      v-btn(flat icon v-if="back && !open" @click="toggle(true)")
        v-icon keyboard_arrow_down
      v-btn(flat icon v-if="back && open" @click="toggle(false)")
        v-icon keyboard_arrow_up
      v-spacer
      v-btn(flat icon color="primary" v-if="!back || open" @click="editDialog = true")
        v-icon mode_edit
      v-btn(flat icon color="red" v-if="!back || open" @click="removeDialog = true")
        v-icon delete
    v-dialog(v-model="editDialog")
      v-card
        v-card-title
          span.headline メモを編集
        v-card-text.pt-0.pb-0
          v-text-field.pa-0(
            :full-width="true"
            :hide-details="true"
            :multiLine="true"
            :placeholder="InitialText"
            :value="text"
            @input="v => updateMemo({ id: memo.id, data: parseText(v) })"
          )
        v-card-actions
          v-spacer
          v-btn(flat color="primary" @click="editDialog = false") 閉じる
    v-dialog(v-model="removeDialog")
      v-card
        v-card-title
          span.headline メモを削除
        v-card-text 本当にメモを削除しますか？
        v-card-actions
          v-spacer
          v-btn(flat color="red" @click="removeMemo(memo.id)") 削除
          v-btn(flat @click="removeDialog = false") キャンセル
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { parseText, toText, InitialText } from '../utilities/memo';

function byLine(text) {
  if (typeof text !== 'string') return text;
  return text.split(/\r?\n/g);
}

export default {
  computed: {
    ...mapState(['chatControl']),
    text() {
      return toText(this.memo);
    },
    front() {
      return byLine(this.memo.front);
    },
    back() {
      return byLine(this.memo.back);
    },
  },
  data() {
    return {
      editDialog: false,
      open: false,
      removeDialog: false,
      InitialText,
    };
  },
  methods: {
    ...mapActions(['updateMemo', 'removeMemo', 'sendStructuredMessage']),
    parseText,
    toggle(open) {
      this.open = open;
      if (open) {
        const {
          name,
        } = this.chatControl;
        const {
          title,
        } = this.memo;

        this.sendStructuredMessage({
          name,
          title,
          body: [{
            type: 'memoOpen',
            text: `${title}の裏面を開きました。`,
          }],
        });
      }
    },
  },
  props: {
    memo: Object,
  },
};
</script>
