<template lang="pug">
  v-dialog(:value="value" @input="$emit('input', $event)")
    v-card
      v-card-title.headline ログ保存
      v-card-text
        form(@submit.prevent="save")
          v-radio-group(v-model="type")
            v-radio(value="html" label="HTML")
            v-radio(value="txt" label="テキスト")
          v-checkbox(v-model="showTimestamp" label="日時を含める")
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="save") 保存
        v-btn(@click="$emit('input', false)") 閉じる
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

const ContainerTemplate = {
  txt: '<%= messages %>',
  html: [
    '<!DOCTYPE html>',
    '<html lang="ja">',
    '<head>',
    '<meta charset="UTF-8">',
    '<title><%= title %></title>',
    '<style>td { vertical-align: top; }</style>',
    '</head>',
    '<h1><%= title %></h1>',
    '<table><tbody>',
    '<%= messages %>',
    '</tbody></table>',
    '</body>',
    '</html>',
  ].join(''),
};
const MessageTemplate = {
  txt: '<%= name%>:\t<%= message %>\t<%= timestamp %>',
  html: [
    '<tr style="color: <%= color %>;">',
    '<td><%= name %></td>',
    '<td><%= messageWithBr %></td>',
    '<td><%= timestamp %></td>',
    '</tr>',
  ].join(''),
};

export default {
  data: () => ({
    type: 'html',
    showTimestamp: true,
  }),
  methods: {
    save() {
      const { type } = this;
      const messages = this.messages.map((message) => {
        const data = {
          ...message,
          message: message.body.map(b => b.text).join(' '),
          messageWithBr: message.body.map(b => b.text).join('<br>'),
          timestamp: this.showTimestamp ? moment(message.createdAt).format('lll') : '',
        };
        return _.template(MessageTemplate[type])(data);
      }).join('\r\n');

      const data = {
        title: this.room.title,
        messages,
      };
      const text = _.template(ContainerTemplate[type])(data);

      const blob = new Blob([text]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.room.title}.${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
  props: {
    messages: {
      required: true,
      type: Array,
    },
    room: {
      required: true,
      type: Object,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
