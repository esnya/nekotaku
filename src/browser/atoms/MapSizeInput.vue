<template lang="pug">
  v-text-field(
    type="number"
    name="`map${label}`"
    :error-messages="errors.collect(`map${label}`)"
    :label="label"
    :value="value"
    v-validate="'required|numeric'"
    @change="onInput(Number($event))"
  )
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Number, true)],
  props: {
    label: {
      required: true,
      type: String,
    },
  },
};
</script>
