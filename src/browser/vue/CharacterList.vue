<template lang="pug">
  v-data-table(
    :headers="headers"
    :items="characters"
    hide-actions
  ).elevation-1.mt-5
    template(slot="items", scope="props")
      td {{props.item.name}}
      td.text-xs-center {{props.item.initiative}}
      td.text-xs-center(v-for="(attribute, index) in room.characterAttributes") {{props.item.attributes[index]}}
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'room',
      'characters',
    ]),
    headers() {
      const {
        characterAttributes,
      } = this.room;

      return [
        {
          text: '名前',
          align: 'center',
          sortable: true,
          value: 'name',
        },
        {
          text: 'イニシアチブ',
          align: 'center',
          sortable: true,
          value: 'initiative',
        },
      ].concat(
        characterAttributes.map(attribute => ({
          text: attribute,
          align: 'center',
          sortable: false,
          value: attribute,
        })),
      );
    },
  },
};
</script>
