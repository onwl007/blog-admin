<template>
  <div class="tag-list">
    <Tag
      v-bind="$attrs"
      v-for="(v, index) in val"
      :key="index"
      :name="index"
      :closable="canEdit"
      @on-close="deleteTag(index)"
      >{{ v }}</Tag
    >
    <span class="action" v-if="canEdit">
      <Button
        icon="md-add"
        type="dashed"
        size="small"
        v-if="!adding"
        @click="toogleTagAdd"
        >{{ actionText }}</Button
      >
      <Input
        size="small"
        style="width: 84px;"
        v-model="input"
        v-else
        @on-enter="addTag"
      ></Input>
    </span>
  </div>
</template>

<script>
export default {
  name: 'TagList',
  props: {
    value: {
      type: [String],
    },
    actionText: {
      type: String,
      default: '添加标签',
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      adding: false,
      input: '',
      val: [],
    }
  },

  watch: {
    value: {
      handler(val, oldVal) {
        if (oldVal !== val) {
          this.val = val
        }
      },
      immediate: true,
    },
  },

  methods: {
    addTag() {
      if (this.input) {
        this.val.push(this.input)
        this.$emit('on-change', this.val, () => this.toogleTagAdd())
      } else {
        this.toogleTagAdd()
      }
    },

    deleteTag(index) {
      this.val.splice(index, 1)
      this.$emit('on-change', this.val)
    },

    toogleTagAdd() {
      this.adding = !this.adding
      this.input = ''
    },
  },
}
</script>

<style></style>
