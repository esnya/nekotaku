<template lang="pug">
  v-autocomplete(
    required
    label="ダイスの種類"
    item-text="gameName"
    item-value="filename"
    :items="diceBotDescs"
    :rules="[notEmpty]"
    :value="value"
    :z-index="10000"
    @input="$emit('input', $event)"
  )
</template>

<script>
export default {
  data() {
    return {
      diceBotDescs: [],
    };
  },
  async created() {
    const { getDiceBotDescs } = await import(/* webpackChunkName: "bcdice" */'../utilities/bcdice');
    this.diceBotDescs = getDiceBotDescs();
  },
  methods: {
    notEmpty(v) {
      return v ? true : '入力して下さい。';
    },
  },
  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>

<style lang="stylus">
.dialog
  overflow: initial
</style>
