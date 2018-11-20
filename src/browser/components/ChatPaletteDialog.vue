<template lang="pug">
  v-dialog(:value="value" @input="v => $emit('input', v)")
    v-card
      v-card-title.headline チャットパレット
      v-card-text
        div(v-for="(tab, i) in tabs" :key="i" :id="`chat-palette-${i}`")
          v-container(v-if="edit")
            v-textarea(
              :value="tabs[i].palette.join('\\n')"
              @input="v => update(i, v)"
            )
          v-list(v-else)
            v-list-tile(
              v-for="(line, j) in tab.palette"
              :key="j"
              @click="itemClick(i, j)"
            )
              v-list-tile-content
                v-list-tile-title {{line}}
              transition(name="slide-rr")
                v-list-tile-action(v-if="isSelected(i, j)")
                  v-icon(primary @click.stop="send(i, line)") send
      v-card-actions
        v-btn(color="primary" v-if="edit" @click="edit = false") 編集終了
        v-btn(color="primary" v-else @click="edit = true") 編集
        v-spacer
        v-btn(@click.stop="$emit('input', false)") 閉じる
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import localStorage from '../utilities/localStorage';

function getStorageKey(roomId) {
  return `nekotaku:chat-palette:${roomId}`;
}

const InitialData = [
  {
    palette: [
      '2D6+{器用度ボーナス} 命中判定!',
      '2D6+{敏捷度ボーナス} 回避判定!',
      '//器用度ボーナス=2',
      '//敏捷度ボーナス=3',
    ],
  },
];

const saveTabs = _.debounce(
  (roomId, tabs) => localStorage.setItem(getStorageKey(roomId), JSON.stringify(tabs)),
  1000,
);

export default {
  computed: {
    ...mapGetters([
      'chatControl',
    ]),
    color() {
      return this.chatControl.color;
    },
    name() {
      return this.chatControl.name;
    },
  },
  data() {
    return {
      tabs: [],
      tab: 'chat-palette-0',
      selectedTab: null,
      selectedLine: null,
      edit: false,
    };
  },
  methods: {
    isSelected(tab, line) {
      return this.selectedTab === tab && this.selectedLine === line;
    },
    itemClick(tab, line) {
      if (this.isSelected(tab, line)) {
        this.selectedTab = null;
        this.selectedLine = null;
      } else {
        this.selectedTab = tab;
        this.selectedLine = line;
      }
    },
    update(tab, text) {
      this.tabs[tab].palette = text.split(/\n/g);
      saveTabs(this.room.id, this.tabs);
    },
    async send(tab, line) {
      const {
        color,
        name,
      } = this;
      const {
        dice,
      } = this.room.dice;

      const { palette } = this.tabs[tab];
      const attrs = _(palette)
        .map(l => l.match(/^[/／][/／](.+)=([-+]?[0-9]+)$/))
        .filter(m => m)
        .map(m => [`{${m[1]}}`, m[2]]);
      const body = attrs.reduce((prev, curr) => prev.replace(curr[0], curr[1]), line);

      const {
        executeDice,
        getDiceBotDescByFilename,
      } = await import(/* webpackChunkName: "bcdice" */ '@/browser/utilities/bcdice');

      const {
        result,
        diceResults,
      } = await executeDice(body, dice);

      const diceBotDesc = getDiceBotDescByFilename(dice);

      const parsed = body.split(/\n/g).map(text => ({ type: 'text', text })).concat(result === '1' ? [] : [{
        type: 'dice',
        dice: diceBotDesc ? diceBotDesc.gameType : dice,
        text: result.replace(/^: /, ''),
        diceResults,
      }]);

      this.$models.messages.push(this.room.id, {
        body: parsed,
        color,
        face: 'default',
        name,
        createdAt: Date.now(),
      });
    },
  },
  props: {
    room: {
      type: Object,
      required: true,
    },
    value: {
      required: true,
      type: Boolean,
    },
  },
  created() {
    const data = localStorage.getItem(getStorageKey(this.room.id));
    this.tabs = data ? JSON.parse(data) : InitialData;
  },
};
</script>
