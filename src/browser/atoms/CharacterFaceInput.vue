<template lang="pug">
  v-text-field(
    required
    label="表情名"
    name="characterFaceName"
    :disabled="disabled"
    :error-messages="errors.collect('characterFaceName')"
    :value="value"
    v-validate="'required'"
    @change="onInput"
  )
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(String, false)],
  props: {
    disabled: {
      default: false,
      required: false,
      type: Boolean,
    },
  },
};
</script>
