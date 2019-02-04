<template lang="pug">
  v-text-field(
    required
    label="名前"
    name="chatName"
    :error-messages="errors.collect('chatName')"
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
