<template lang="pug">
  v-textarea(
    name="chatPaletteItems"
    :error-messages="errors.collect('chatPaletteItems')"
    :value="value.join('\\n')"
    v-validate="'required'"
    @change="onInputItems"
  )
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Array, true)],
  methods: {
    onInputItems(items) {
      this.onInput(items.split(/\r?\n/g));
    },
  },
};
</script>
