<template lang="pug">
  div
    div(v-for="node in nodes")
      div(v-if="node.type === 'text'") {{node.text}}
      v-card.my-2(v-else-if="node.type === 'dice'")
        v-card-title.caption.px-2.pt-2.pb-0 {{node.dice}}
        v-card-text.pa-2 {{node.text}}
</template>

<script>
export default {
  props: [
    'nodes',
  ],
};
</script>

