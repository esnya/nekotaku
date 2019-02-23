<template lang="pug">
  simple-dialog(title="表示設定" :value="value" @input="$emit('input', $event)")
    messages-limit-input(:value="viewLimit" @input="setViewLimit")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MessagesLimitInput from '@/browser/atoms/MessagesLimitInput.vue';
import SimpleDialog from '@/browser/moleculers/SimpleDialog.vue';
import chatStore from '@/browser/store/chatStore';

@Component({
  components: {
    MessagesLimitInput,
    SimpleDialog,
  },
})
export default class ViewConfigurationDialog extends Vue {
  @Prop({ required: true }) value!: boolean;

  get viewLimit() {
    return chatStore.viewLimit;
  }

  setViewLimit(viewLimit: number) {
    chatStore.setViewLimit(viewLimit);
  }
}
</script>
