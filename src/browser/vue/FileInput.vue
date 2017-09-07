<template lang="pug">
  v-btn(@click="open")
    slot
    input(
      hidden,
      ref="input",
      type="file",
      @change="upload"
      :accept="accept"
      :required="required"
    )
</template>

<script>
export default {
  methods: {
    open() {
      this.$refs.input.dispatchEvent(new MouseEvent('click'));
    },
    upload() {
      const [file] = this.$refs.input.files;
      if (!file) {
        this.$emit('input', null);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.$emit('input', new Blob([reader.result], file));
        };
        reader.readAsArrayBuffer(file);
      }
    },
  },
  props: [
    'required',
    'accept',
  ],
};
</script>
