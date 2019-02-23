<template lang="pug">
  bottom-dialog(:value="value" @input="$emit('input', $event)")
    v-list.pt-0
      chat-configuration-tile(@click="configuration = true")
      chat-whisper-tile(@click="whisper = true")
      chat-palette-tile(@click="palette = true")
      chat-face-tile(@click="face = true")
    chat-configuration-dialog(:room="room" v-model="configuration")
    chat-palette-dialog(v-model="palette")
    whisper-target-dialog(:members="members" v-model="whisper")
    chat-face-dialog(:characters="characters" v-model="face")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BottomDialog from '@/browser/moleculers/BottomDialog.vue';
import ChatConfigurationDialog from '@/browser/moleculers/ChatConfigurationDialog.vue';
import ChatConfigurationTile from '@/browser/atoms/ChatConfigurationTile.vue';
import ChatFaceDialog from '@/browser/moleculers/ChatFaceDialog.vue';
import ChatFaceTile from '@/browser/atoms/ChatFaceTile.vue';
import ChatPaletteDialog from '@/browser/moleculers/ChatPaletteDialog.vue';
import ChatPaletteTile from '@/browser/atoms/ChatPaletteTile.vue';
import ChatWhisperTile from '@/browser/atoms/ChatWhisperTile.vue';
import WhisperTargetDialog from '@/browser/moleculers/WhisperTargetDialog.vue';
import Character from '@/models/Character';
import Member from '@/models/Member';
import Room from '@/models/Room';

@Component({
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
})
export default class ChatActionDialog extends Vue {
  @Prop({ required: true }) value!: boolean;
  @Prop({ required: true }) characters!: Character[];
  @Prop({ required: true }) members!: Member[];
  @Prop({ required: true }) room!: Room;
  
  configuration: boolean = false;
  face: boolean = false;
  palette: boolean = false;
  whisper: boolean = false;
}
</script>
