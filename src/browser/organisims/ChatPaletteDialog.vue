<template lang="pug">
  bottom-dialog(:container="false" :value="value" @input="onInput" v-if="chatPaletts")
    chat-palette-tabs(:chat-paletts="chatPaletts" @close="onInput(false)")
</template>

<script>
import BottomDialog from '@/browser/moleculers/BottomDialog.vue';
import ChatPaletteTabs from '@/browser/moleculers/ChatPaletteTabs.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';
import { bindAsObject } from '@/browser/models';

export default {
  mixins: [
    bindAsObject('chatPaletts'),
    modelWrapper(Boolean, true),
  ],
  components: {
    BottomDialog,
    ChatPaletteTabs,
  },
};
</script>
