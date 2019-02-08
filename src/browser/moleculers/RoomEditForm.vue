<template lang="pug">
  .neko-room-edit-form
    room-title-input(v-model="title")
    room-channels-input(v-model="channels")
    dice-select(v-model="dice")
    character-attribute-types-input(v-model="characterAttributes")
</template>

<script>
import CharacterAttributeTypesInput from '@/browser/atoms/CharacterAttributeTypesInput.vue';
import DiceSelect from '@/browser/atoms/DiceSelect.vue';
import RoomChannelsInput from '@/browser/atoms/RoomChannelsInput.vue';
import RoomTitleInput from '@/browser/atoms/RoomTitleInput.vue';

function field(key) {
  return {
    get() {
      return this.value[key];
    },
    set(value) {
      this.$emit('input', {
        ...this.value,
        [key]: value,
      });
    },
  };
}

export default {
  components: {
    CharacterAttributeTypesInput,
    DiceSelect,
    RoomChannelsInput,
    RoomTitleInput,
  },
  computed: {
    channels: field('channels'),
    characterAttributes: field('characterAttributes'),
    dice: field('dice'),
    title: field('title'),
  },
  props: {
    value: {
      required: true,
      type: Object,
    },
  },
};
</script>
