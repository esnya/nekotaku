<template lang="pug">
  v-tabs(v-model="tab")
    v-tab(v-for="palette in paletts") {{palette.name}}
    add-icon-button(@click="add")
    v-tab-item(:key="i" v-for="(palette, i) in paletts")
      chat-palette(
        :chatPalette="palette"
        @close="$emit('close')"
        @delete="deletePalette(i)"
        @update="update(i, $event)"
      )
</template>

<script>
import shortid from 'shortid';
import AddIconButton from '@/browser/atoms/AddIconButton.vue';
import ChatPalette from '@/browser/moleculers/ChatPalette.vue';

export default {
  components: {
    AddIconButton,
    ChatPalette,
  },
  data: () => ({
    tab: 0,
  }),
  computed: {
    paletts() {
      return this.chatPaletts.paletts || [];
    },
  },
  methods: {
    add() {
      this.$models.chatPaletts.update(this.roomId, {
        paletts: [
          ...(this.chatPaletts.paletts || []),
          {
            id: shortid(),
            name: '新しいチャットパレット',
            items: [],
          },
        ],
      });
    },
    deletePalette(index) {
      this.$models.chatPaletts.update(this.roomId, {
        paletts: this.chatPaletts.paletts.filter((v, i) => i !== index),
      });
    },
    update(index, value) {
      this.$models.chatPaletts.update(
        this.roomId,
        {
          paletts: this.chatPaletts.paletts.map((v, i) => (i === index ? value : v)),
        },
      );
    },
  },
  props: {
    chatPaletts: {
      required: true,
      type: Object,
    },
  },
};
</script>
