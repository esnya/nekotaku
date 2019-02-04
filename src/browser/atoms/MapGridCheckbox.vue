<template lang="pug">
  v-checkbox(
    label="グリッドを表示"
    :value="value"
    @change="onInput(Boolean($event))"
  )
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
};
</script>
