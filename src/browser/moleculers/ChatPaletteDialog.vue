<template lang="pug">
  bottom-dialog(:container="false" :value="value" @input="onInput")
    chat-palette-tabs(:chat-paletts="chatPaletts || {}" @close="onInput(false)")
</template>

<script>
import BottomDialog from '@/browser/moleculers/BottomDialog.vue';
import ChatPaletteTabs from '@/browser/moleculers/ChatPaletteTabs.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [
    modelWrapper(Boolean, true),
  ],
  components: {
    BottomDialog,
    ChatPaletteTabs,
  },
};
</script>
