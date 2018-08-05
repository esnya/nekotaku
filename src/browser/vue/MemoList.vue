<template lang="pug">
  v-container.pt-5.pb-5
    v-layout.row.wrap.pb-5
      v-flex.pa-2(xs12 sm6 v-for="memo in memos" :key="memo.id")
        memo-list-item(:memo="memo")
    v-dialog(v-model="addDialog")
      v-btn.ma-2(
        dark
        fab
        fixed
        color="primary"
        slot="activator"
        :style="{ left: 'calc(200vw - 76px)', top: 'calc(100vh - 132px)' }"
      )
        v-icon add
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
import { mapActions, mapState } from 'vuex';
import { parseText, InitialText } from '../utilities/memo';
import MemoListItem from './MemoListItem.vue';

export default {
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
  computed: mapState(['memos']),
  methods: {
    ...mapActions(['addMemo']),
    submitMemo() {
      const data = parseText(this.addText);
      this.addMemo(data);

      this.addDialog = false;
      this.addText = InitialText;
    },
  },
};
</script>

<style lang="stylus" scoped>
.btn.btn--fixed.btn--bottom.btn--right
  bottom 56px
  right -100%
</style>
