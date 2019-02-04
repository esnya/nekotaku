<template lang="pug">
  v-autocomplete(
    required
    name="dice"
    item-text="gameName"
    item-value="filename"
    label="ダイスの種類"
    :error-messages="errors.collect('dice')"
    :items="diceBotDescs"
    :menu-props="{ zIndex:10000 }"
    :value="value"
    @input="$emit('input', $event)"
    v-validate="'required'"
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
