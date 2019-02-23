<template lang="pug">
  creation-dialog(
    title="卓を立てる"
    :creating="creating"
    :value="value"
    @input="emitInput"
    @create="onCreate"
  )
    room-edit-form(v-model="room")
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Vue,
} from 'vue-property-decorator';
import DiceSelect from '@/browser/atoms/DiceSelect.vue';
import CreationDialog from '@/browser/moleculers/CreationDialog.vue';
import RoomEditForm from '@/browser/moleculers/RoomEditForm.vue';
import roomDAO from '@/browser/dao/roomDAO';
import { RoomAdd } from '@/models/Room';
import { Room } from '@/browser/routes';
import run from '@/browser/utilities/task';

@Component({
  components: {
    CreationDialog,
    DiceSelect,
    RoomEditForm,
  },
})
export default class RoomCreateDialog extends Vue {
  @Prop({ required: true }) value!: Boolean;

  creating: boolean = false;
  room: RoomAdd = {
    title: '卓',
    dice: 'DiceBot',
    channels: ['メイン', '雑談'],
    characterAttributes: [],
  };

  @Emit('input')
  emitInput(value: boolean): void {}

  async onCreate(room: RoomAdd): Promise<void> {
    this.creating = true;
    await run(async () => {
      if (!await this.$validator.validateAll()) return;

      const roomId = await roomDAO.add(this.room);

      this.emitInput(false);

      this.$router.push({ name: Room.name, params: { roomId } });
    });
    this.creating = false;
  }
}
</script>
