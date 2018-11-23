<template lang="pug">
  g.neko-shape(:style="style")
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
    g.neko-text(
      v-else-if="shape.type === 'ruler'"
      :style="ruler.gStyle"
    )
      text(
        alignment-baseline="bottom"
        text-anchor="middle"
        y="-4"
        :style="ruler.textStyle"
      ) {{ruler.length}}
      line(
        :x1="-ruler.length * 25"
        :x2="ruler.length * 25"
      )
      line(
        :x1="-ruler.length * 25"
        y1="-8"
        :x2="-ruler.length * 25"
        y2="8"
      )
      line(
        :x1="ruler.length * 25"
        y1="-8"
        :x2="ruler.length * 25"
        y2="8"
      )
    polyline(
      :points="shape.points.map(a => a.map(b => b * 50).join(' ')).join(' ')"
      v-else-if="shape.type === 'polyline'"
    )
    text(
      :x="shape.x"
      :y="shape.x"
      :style="textStyle"
      v-else-if="shape.type === 'text'"
    ) {{shape.text}}
</template>

<script>
export default {
  computed: {
    ruler() {
      const {
        type,
        rx, ry,
        stroke,
        strokeOpacity,
      } = this.shape;

      if (type !== 'ruler') return {};

      return {
        gStyle: {
          transform: `rotate(${-Math.atan2(-ry, rx)}rad)`,
        },
        textStyle: {
          fill: this.holder ? 'none' : stroke,
          fillOpacity: strokeOpacity,
          stroke: 'none',
          strokeWidth: 0,
        },
        length: Math.round(Math.sqrt((rx ** 2) + (ry ** 2)) * 100) / 100,
      };
    },
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
    textStyle() {
      const {
        fill,
        fillOpacity,
        fontSize,
      } = this.shape;

      return {
        fill,
        fillOpacity,
        fontSize,
        stroke: 'none',
      };
    },
  },
  props: [
    'holder',
    'shape',
  ],
};
</script>
