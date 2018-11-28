<template lang="pug">
  v-btn(@click="open")
    slot
    input(
      hidden
      ref="input"
      type="file"
      :accept="accept"
      :key="key"
      @change="upload"
    )
</template>

<script>
export default {
  data: () => ({
    key: Math.random(),
  }),
  methods: {
    open() {
      this.$refs.input.dispatchEvent(new MouseEvent('click'));
    },
    upload() {
      const [file] = this.$refs.input.files;
      if (file) this.$emit('input', file);
      this.key = Math.random();
    },
  },
  props: {
    accept: {
      type: String,
    },
  },
};
</script>
