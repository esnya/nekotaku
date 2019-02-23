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
          v-textarea.pa-0(
            hide-details
            :placeholder="InitialText"
            v-model="memoText"
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
          v-btn(flat color="red" @click="remove") 削除
          v-btn(flat @click="removeDialog = false") キャンセル
</template>

<script>
import { mapGetters } from 'vuex';
import { InitialText, parseText, toText } from '../utilities/memo';
import messageDAO from '@/browser/dao/messageDAO';
import memoDAO from '@/browser/dao/memoDAO';

function byLine(text) {
  if (typeof text !== 'string') return text;
  return text.split(/\r?\n/g);
}

export default {
  computed: {
    ...mapGetters(['chatControl']),
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
      memoText: toText(this.memo),
      InitialText,
    };
  },
  methods: {
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

        messageDAO.add(
          {
            name,
            title,
            body: [{
              type: 'memoOpen',
              text: `${title}の裏面を開きました。`,
            }],
          },
        );
      }
    },
    async update() {
      const data = parseText(this.memoText);
      await memoDAO.update(data, this.memo.id);
    },
    async remove() {
      await memoDAO.remove(this.memo.id);
    },
  },
  watch: {
    editDialog(open) {
      if (open) this.memoText = this.text;
      else {
        this.update();
      }
    },
  },
  props: {
    memo: {
      required: true,
      type: Object,
    },
  },
};
</script>
