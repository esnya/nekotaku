<template lang="pug">
  v-text-field(
    required
    label="卓タイトル"
    name="roomName"
    :error-messages="errors.collect('roomName')"
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
