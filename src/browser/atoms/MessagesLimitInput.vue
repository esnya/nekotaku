<template lang="pug">
  v-text-field(
    label="チャット表示件数"
    type="number"
    name="messagesLimit"
    :error-messages="errors.collect('messagesLimit')"
    :value="value"
    v-validate="'required|numeric'"
    @change="onInput(Number($event))"
  )
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Number, true)],
};
</script>
