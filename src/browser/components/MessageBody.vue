<template lang="pug">
  div
    message-body-node(
      :key="i"
      :node="node"
      :created-at="createdAt"
      v-for="(node, i) in nodes"
    )
</template>

<script>
import MessageBodyNode from '@/browser/components/MessageBodyNode.vue';

export default {
  components: {
    MessageBodyNode,
  },
  props: {
    nodes: {
      type: Array,
      required: true,
    },
    createdAt: {
      type: Number,
      required: true,
    },
  },
};
</script>
