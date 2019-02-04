<template lang="pug">
  v-text-field(
    type="number"
    :error-messages="errors.collect(name)"
    :label="label"
    :name="name"
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
    name: {
      required: true,
      type: String,
    },
  },
};
</script>
