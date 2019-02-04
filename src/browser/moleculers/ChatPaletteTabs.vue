<template lang="pug">
  v-tabs(v-model="tab")
    v-tab(v-for="palette in chatPaletts") {{palette.name}}
    add-icon-button(@click="add")
    v-tab-item(:key="i" v-for="(palette, i) in chatPaletts")
      chat-palette(
        :chatPalette="palette"
        @close="$emit('close')"
        @delete="deletePalette(i)"
        @update="update(i, $event)"
      )
</template>

<script>
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
  methods: {
    add() {
      this.$models.chatPaletts.update(this.roomId, [
        ...this.chatPaletts,
        {},
      ]);
    },
    deletePalette(index) {
      this.$models.chatPaletts.update(this.roomId, this.chatPaletts.filter((v, i) => i !== index));
    },
    update(index, value) {
      this.$models.chatPaletts.update(
        this.roomId,
        this.chatPaletts.map((v, i) => (i === index ? value : v)),
      );
    },
  },
  props: {
    chatPaletts: {
      required: true,
      type: Array,
    },
  },
};
</script>
