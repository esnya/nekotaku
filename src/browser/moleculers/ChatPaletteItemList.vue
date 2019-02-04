<template lang="pug">
  v-list
    chat-palette-tile(
      :item="item"
      :key="i"
      @click="update(item)"
      v-for="(item, i) in chatPalette.items"
      v-if="item"
    )
</template>

<script>
import _ from 'lodash';
import { mapMutations } from 'vuex';
import ChatPaletteTile from '@/browser/atoms/ChatPaletteItemTile.vue';

export default {
  components: {
    ChatPaletteTile,
  },
  methods: {
    ...mapMutations(['updateChatMessage']),
    update(item) {
      const {
        items,
      } = this.chatPalette;

      const attrs = _(items)
        .map(l => l.match(/^[/／][/／](.+)=([-+]?[0-9]+)$/))
        .filter(m => m)
        .map(m => [`{${m[1]}}`, m[2]]);

      const message = attrs.reduce((prev, curr) => prev.replace(curr[0], curr[1]), item);
      this.updateChatMessage(message);

      this.$emit('close');
    },
  },
  props: {
    chatPalette: {
      required: true,
      type: Object,
    },
  },
};
</script>
