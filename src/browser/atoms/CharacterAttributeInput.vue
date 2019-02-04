<template lang="pug">
  v-text-field(
    :label="attributeType"
    :name="`characterAttributeType[${attributeType}]`"
    :error-messages="errors.collect(`characterAttributeType[${attributeType}]`)"
    :value="value"
    @change="onInput"
  )
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(false)],
  props: {
    attributeType: {
      required: true,
      type: String,
    },
  },
};
</script>
