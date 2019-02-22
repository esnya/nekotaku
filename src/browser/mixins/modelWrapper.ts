export default function modelWrapper(type: Object, required: boolean): Object {
  return {
    methods: {
      onInput(this: any, event: Event) {
        this.$emit('input', event);
      },
    },
    props: {
      value: {
        required,
        type,
      },
    },
  };
}
