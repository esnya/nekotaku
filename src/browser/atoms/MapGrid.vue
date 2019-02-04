<template lang="pug">
  canvas(ref="canvas" :width="width * 50" :height="height * 50")
</template>

<script>
/* eslint no-param-reassign: off */

const color = 'rgba(32, 32, 32, 1)';

function clear(context, width, height) {
  context.clearRect(0, 0, width * 50, height * 50);
}

function renderGrid(context, width, height) {
  context.fillStyle = 'none';
  context.strokeStyle = color;
  for (let y = 0; y <= height; y += 1) {
    context.moveTo(0, y * 50);
    context.lineTo(width * 50, y * 50);
  }
  for (let x = 0; x <= height; x += 1) {
    context.moveTo(x * 50, 0);
    context.lineTo(x * 50, height * 50);
  }
  context.stroke();
}

function renderGridLabel(context, width, height) {
  context.fillStyle = color;
  context.strokeStyle = 'none';
  context.textAlign = 'center';
  for (let y = 0; y <= height; y += 1) {
    for (let x = 0; x <= height; x += 1) {
      context.fillText(`${x + 1} - ${y + 1}`, x * 50 + 25, y * 50 + 40, 50);
    }
  }
}

export default {
  methods: {
    render() {
      const {
        width,
        height,
      } = this;

      const { canvas } = this.$refs;
      const context = canvas.getContext('2d');

      clear(context, width, height);
      renderGrid(context, width, height);
      renderGridLabel(context, width, height);
    },
  },
  watch: {
    width() {
      this.render();
    },
    height() {
      this.render();
    },
  },
  mounted() {
    this.render();
  },
  props: {
    width: {
      required: true,
      type: Number,
    },
    height: {
      required: true,
      type: Number,
    },
  },
};
</script>
