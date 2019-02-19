<template lang="pug">
  bottom-dialog(:value="value" @input="onInput")
    v-list.pt-0
      chat-configuration-tile(@click="open('configuration')")
      chat-whisper-tile(@click="open('whisper')")
      chat-palette-tile(@click="open('palette')")
      chat-face-tile(@click="open('face')")
    chat-configuration-dialog(:room="room" v-model="configuration")
    chat-palette-dialog(v-model="palette")
    whisper-target-dialog(:members="members" v-model="whisper")
    chat-face-dialog(:characters="characters" v-model="face")
</template>

<script>
import { bindAsList } from '@/browser/models';
import { mapGetters } from 'vuex';
import BottomDialog from '@/browser/moleculers/BottomDialog.vue';
import ChatConfigurationDialog from '@/browser/moleculers/ChatConfigurationDialog.vue';
import ChatConfigurationTile from '@/browser/atoms/ChatConfigurationTile.vue';
import ChatFaceDialog from '@/browser/moleculers/ChatFaceDialog.vue';
import ChatFaceTile from '@/browser/atoms/ChatFaceTile.vue';
import ChatPaletteDialog from '@/browser/moleculers/ChatPaletteDialog.vue';
import ChatPaletteTile from '@/browser/atoms/ChatPaletteTile.vue';
import ChatWhisperTile from '@/browser/atoms/ChatWhisperTile.vue';
import WhisperTargetDialog from '@/browser/moleculers/WhisperTargetDialog.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [
    bindAsList('characters'),
    modelWrapper(Boolean, true),
  ],
  components: {
    ChatConfigurationDialog,
    ChatConfigurationTile,
    ChatFaceDialog,
    ChatFaceTile,
    ChatPaletteDialog,
    ChatPaletteTile,
    ChatWhisperTile,
    BottomDialog,
    WhisperTargetDialog,
  },
  data: () => ({
    configuration: false,
    face: false,
    palette: false,
    whisper: false,
  }),
  methods: {
    open(key) {
      this[key] = true;
      this.$emit('input', false);
    },
  },
  props: {
    members: {
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
