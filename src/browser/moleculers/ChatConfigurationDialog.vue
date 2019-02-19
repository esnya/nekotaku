<template lang="pug">
  bottom-dialog(
    title="チャット設定"
    :container="false"
    :value="value"
    @input="onInput"
  )
    chat-configuration-tabs
</template>

<script>
import BottomDialog from '@/browser/moleculers/BottomDialog.vue';
import ChatConfigurationTabs from '@/browser/moleculers/ChatConfigurationTabs.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
  components: {
    ChatConfigurationTabs,
    BottomDialog,
  },
};
</script>
