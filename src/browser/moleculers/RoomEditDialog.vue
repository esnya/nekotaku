<template lang="pug">
  simple-dialog(title="卓を編集" :value="value" @input="$emit('input', $event)")
    room-edit-form(:value="room" @input="onUpdateRoom")
</template>

<script>
import RoomEditForm from '@/browser/moleculers/RoomEditForm.vue';
import SimpleDialog from '@/browser/moleculers/SimpleDialog.vue';

export default {
  components: {
    RoomEditForm,
    SimpleDialog,
  },
  methods: {
    onUpdateRoom(value) {
      this.$models.room.update(this.roomId, value);
    },
  },
  props: {
    room: {
      required: true,
      type: Object,
    },
    value: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
