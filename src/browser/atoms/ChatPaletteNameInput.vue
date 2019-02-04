<template lang="pug">
  v-text-field(
    label="チャットパレット名"
    name="chatPaletteName"
    :error-messages="errors.collect('chatPaletteName')"
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
