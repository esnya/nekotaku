<template lang="pug">
  v-radio-group(:value="value" @change="onInput")
    v-radio(value="html" label="HTML")
    v-radio(value="txt" label="テキスト")
    v-radio(value="json" label="JSON")
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(String, true)],
};
</script>
