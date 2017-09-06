<template lang="pug">
  g(:style="style")
    circle(
      v-if="shape.type === 'circle'"
      cx="0"
      cy="0"
      :r="shape.radius * 50"
    )
    line(
      v-else-if="shape.type === 'line'"
      :x1="-shape.rx * 25"
      :y1="-shape.ry * 25"
      :x2="shape.rx * 25"
      :y2="shape.ry * 25"
    )
    rect(
      v-else-if="shape.type === 'rect'"
      :x="-shape.width * 25"
      :y="-shape.height * 25"
      :width="shape.width * 50"
      :height="shape.height * 50"
    )
</template>

<script>
export default {
  computed: {
    style() {
      const {
        x, y,
        fill,
        fillOpacity,
        stroke,
        strokeOpacity,
        strokeWidth,
      } = this.shape;

      return {
        ...(this.holder ? {
          fill: 'none',
          stroke: 'rgba(0, 0, 0, 0)',
          strokeWidth: 8,
        } : {
          fill: fill || 'none',
          fillOpacity,
          stroke: stroke || 'none',
          strokeOpacity,
          strokeWidth: strokeWidth || null,
        }),
        transform: `translate(${x * 50}px, ${y * 50}px)`,
      };
    },
  },
  props: [
    'holder',
    'shape',
  ],
};
</script>
