<template>
  <div class="edit-input">
    <p class="content" v-if="!editMode">
      {{ value }}
      <Button
        class="edit-btn"
        type="text"
        size="large"
        @click="editMode = true"
      >
        <Icon class="icon" type="ios-create-outline"></Icon>
      </Button>
    </p>
    <Input v-bind="$attrs" v-model="val" v-on="$listeners" v-else></Input>
    <div class="action" v-if="editMode">
      <Button type="text" @click="sumit">确定</Button>
      <Button type="text" @click="cancel">取消</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      editMode: false,
      val: '',
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
    sumit() {
      this.$emit('on-submit', this.val, () => {
        this.editMode = false
      })
    },

    cancel() {
      this.editMode = false
      this.val = this.value
    },
  },
}
</script>

<style scoped>
.edit-input {
  width: 100%;
}
.edit-input .content {
  line-height: 1.5;
}
.edit-input .edit-btn {
  padding: 0 12px;
  line-height: 1;
}
.edit-input .edit-btn .icon {
  line-height: 1;
}
</style>
