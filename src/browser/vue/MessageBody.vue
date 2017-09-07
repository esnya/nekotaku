<template lang="pug">
  div
    div(v-for="(node, i) in nodeWithColors", :key="i")
      v-card.my-2(v-if="node.type === 'dice'", v-bind:class="node.classNames", :dark="node.dark")
        v-card-title.caption.px-2.pt-2.pb-0 {{node.dice}}
        v-card-text.pa-2 {{node.text}}
      div(v-else) {{node.text}}
</template>

<script>
export default {
  computed: {
    nodeWithColors() {
      function getColorOpts(node) {
        if (node.type === 'dice') {
          if (node.text.match(/成功$/)) return { classNames: { green: true }, dark: true };
          else if (node.text.match(/失敗$/)) return { classNames: { red: true }, dark: true };
        }

        return {};
      }

      return this.nodes.map(node => ({
        ...node,
        ...getColorOpts(node),
      }));
    },
  },
  props: [
    'nodes',
  ],
};
</script>

