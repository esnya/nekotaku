<template lang="pug">
  v-card.map-control
    v-btn(icon)
      v-icon zoom_in
    v-btn(icon)
      v-icon zoom_out
    v-btn(icon)
      v-icon zoom_out_map
    div.vertical-divider
    v-btn(icon)
      v-icon(primary) mdi-arrow-all
    div.vertical-divider
    v-btn.btn-svg(icon)
      svg(width="36", height="36")
        line(x1="-12", y1="12", x2="12", y2="-12")
    v-btn.btn-svg(icon)
      svg(width="36", height="36")
        rect(x="-12", y="-12", width="24", height="24")
    v-btn.btn-svg(icon)
      svg(width="36", height="36")
        circle(cx="0", cy="0", r="12")
    div.vertical-divider
    v-btn(icon)
      v-icon palette
</template>

<style lang="stylus" scoped>
.map-control
  overflow: auto;
  white-space: nowrap;
  display: flex;
  justify-content: center;

.vertical-divider
  position: relative;
  top: 8px;
  height: 24px;
  display: inline-block;
  border-right: 1px solid rgba(0, 0, 0, 0.12);

.btn-svg
  padding: 6;

  svg > *
    transform: translate(18px, 18px);
    stroke: rgba(0, 0, 0, 0.5);
    storkeWidth: 2;
    fill: none;
</style>
