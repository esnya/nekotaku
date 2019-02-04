<template lang="pug">
  v-text-field(
    label="キャラクター属性名"
    name="characterAttributeType"
    :error-messages="errors.collect('characterAttributeType')"
    :value="value"
    v-validate="'required'"
    @change="onInput"
  )
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(String, false)],
};
</script>
