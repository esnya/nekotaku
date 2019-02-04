<template lang="pug">
  v-text-field(
    required
    label="キャラクター名"
    name="characterName"
    :error-messages="errors.collect('characterName')"
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
