<template lang="pug">
  v-text-field(
    label="イニシアチブ"
    type="number"
    name="characterInitiative"
    :error-messages="errors.collect('characterInitiative')"
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
