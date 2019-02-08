<template lang="pug">
  v-text-field(
    :error-messages="errors.collect(name)"
    :label="label"
    :name="name"
    :placeholder="placeholder"
    :required="required"
    :value="text"
    v-validate="'required'"
    @change="onInput"
  )
</template>

<script>
export default {
  computed: {
    text() {
      return this.value && this.value.join(',');
    },
  },
  methods: {
    onInput(value) {
      this.$emit('input', (value || '').split(/, */g));
    },
  },
  props: {
    name: {
      required: false,
      type: String,
    },
    label: {
      required: false,
      type: String,
    },
    placeholder: {
      required: false,
      type: String,
    },
    required: {
      required: false,
      type: Boolean,
    },
    value: {
      required: false,
      type: Array,
    },
  },
};
</script>
