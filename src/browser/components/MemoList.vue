<template lang="pug">
  v-container.pt-5.pb-5
    v-layout.row.wrap.pb-5
      v-flex.pa-2(xs12 sm6 v-for="memo in memos" :key="memo.id")
        memo-list-item(
          :memo="memo"
        )
      v-flex.pa-2(xs12)
        v-card
          v-card-actions
            v-btn(flat block @click.stop="addDialog = true")
              v-icon add
    v-dialog(v-model="addDialog")
      v-card
        v-card-title
          span.headline 共有メモ作成
        v-card-text.pt-0.pb-0
          v-textarea.pa-0(
            v-model="addText"
            :hide-details="true"
            :multiLine="true"
            :placeholder="InitialText"
          )
        v-card-actions
          v-spacer
          v-btn(flat color="primary" @click="submitMemo") 作成
          v-btn(flat @click="addDialog = false") キャンセル
</template>

<script>
import { InitialText, parseText } from '../utilities/memo';
import { bindAsList } from '@/browser/models';
import MemoListItem from '@/browser/components/MemoListItem.vue';

export default {
  mixins: [
    bindAsList('memos'),
  ],
  components: {
    MemoListItem,
  },
  data() {
    return {
      addDialog: false,
      addText: InitialText,
      InitialText,
    };
  },
  methods: {
    submitMemo() {
      const data = parseText(this.addText);

      this.$models.memos.push(this.roomId, data);

      this.addDialog = false;
      this.addText = InitialText;
    },
  },
};
</script>

<style lang="stylus" scoped>
.memo-list-add-button
  bottom 112px
  right -100%
</style>
