<template lang="pug">
  v-card
    v-data-table(:headers="headers" :items="characters")
      character-table-row(
        slot="items"
        slot-scope="props"
        :character="props.item"
        :character-attribute-names="characterAttributeNames"
      )
</template>

<script>
import CharacterTableRow from '@/browser/moleculers/CharacterTableRow.vue';

export default {
  components: {
    CharacterTableRow,
  },
  computed: {
    headers() {
      const {
        characterAttributeNames,
      } = this;

      return [
        {
          sortable: false,
        },
        {
          text: '名前',
          value: 'name',
          align: 'center',
          sortable: true,
        },
        {
          text: 'イニシアチブ',
          value: 'initiative',
          align: 'center',
          sortable: true,
        },
      ].concat(characterAttributeNames.map(attributeName => ({
        text: attributeName,
        align: 'center',
        sortable: false,
      })));
    },
  },
  data: () => ({
    addingDialog: false,
  }),
  props: {
    characters: {
      required: true,
      type: Array,
    },
    characterAttributeNames: {
      required: true,
      type: Array,
    },
  },
};
</script>
