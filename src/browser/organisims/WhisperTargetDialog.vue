<template lang="pug">
  bottom-dialog(:value="value" @input="onInput")
    v-layout(align-end)
      whisper-target-select(
        :members="members"
        :value="whisperTargets"
        @input="updateWhisperTargets"
      )
      clear-icon-button(@click="updateWhisperTargets(null)")
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import ClearIconButton from '@/browser/atoms/ClearIconButton.vue';
import WhisperTargetSelect from '@/browser/atoms/WhisperTargetSelect.vue';
import BottomDialog from '@/browser/moleculers/BottomDialog.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
  components: {
    ClearIconButton,
    BottomDialog,
    WhisperTargetSelect,
  },
  computed: {
    ...mapGetters([
      'whisperTargets',
    ]),
  },
  methods: {
    ...mapMutations([
      'updateWhisperTargets',
    ]),
  },
  props: {
    members: {
      required: true,
      type: Object,
    },
  },
};
</script>
