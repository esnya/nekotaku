<template lang="pug">
  bottom-dialog(:value="value" @input="$emit('input', $event)")
    v-layout(align-end)
      whisper-target-select(
        :members="members"
        :value="to"
        @input="setTo"
      )
      clear-icon-button(@click="updateWhisperTargets(null)")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BottomDialog from '@/browser/moleculers/BottomDialog.vue';
import ClearIconButton from '@/browser/atoms/ClearIconButton.vue';
import WhisperTargetSelect from '@/browser/atoms/WhisperTargetSelect.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';
import chatStore from '@/browser/store/chatStore';
import Member from '@/models/Member';

@Component({
  components: {
    ClearIconButton,
    BottomDialog,
    WhisperTargetSelect,
  },
})
export default class WhisperTargetDialog extends Vue {
  @Prop({ required: true }) value!: boolean;
  @Prop({ required: true }) members!: Member[];

  get to(): string[] | null {
    return chatStore.to;
  }

  setTo(to: string[] | null) {
    chatStore.to = to;
  }
}
</script>
