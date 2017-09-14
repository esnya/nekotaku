<template lang="pug">
  v-layout(row ref='group')
    slot
</template>

<script>
export default {
  data() {
    return {
      buttons: [],
      buttonOriginalClass: [],
    };
  },
  methods: {
    update() {
      this.buttons.forEach((button) => {
        button.classList.add('btn--flat');
        button.setAttribute('data-selected', true);

        if (!this.toggle) return;

        if (this.value === button.getAttribute('value')) {
          button.classList.add('primary--text');
        } else {
          button.classList.remove('primary--text');
        }
      });
    },
  },
  props: [
    'toggle',
    'value',
  ],
  watch: {
    value() {
      this.update();
    },
  },
  mounted() {
    this.$vuetify.load(() => {
      this.buttons = this.$slots.default
        .filter(vnode => vnode.tag !== undefined)
        .map(vnode => vnode.elm);

      if (this.toggle) {
        this.buttons.forEach((button) => {
          const listener = () => {
            const value = button.getAttribute('value');
            this.$emit('input', value);
          };
          button.addEventListener('click', listener, { passive: true });
        });
      }

      this.update();
    });
  },
};
</script>

<style lang="stylus" scoped>
.layout
  flex 0 0 auto

.neko-button-group
  .btn
    margin 0
</style>

