<template lang="pug">
  simple-dialog(:value="value" @input="onInput")
    changelog
</template>

<script>
import Changelog from '@/browser/atoms/Changelog.vue';
import SimpleDialog from '@/browser/moleculers/SimpleDialog.vue';

import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
  components: {
    Changelog,
    SimpleDialog,
  },
};
</script>
