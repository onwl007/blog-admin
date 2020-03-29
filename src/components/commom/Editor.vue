<template>
  <div class="editor">
    <i-editor
      v-model="content"
      ref="editor"
      affix
      paste
      v-bind="$attrs"
      :config="{ action: '' }"
      :before-upload="beforeUpload"
    ></i-editor>
  </div>
</template>

<script>
import { uploadTypeMap } from '../commom/Uploader'

export default {
  name: 'Editor',
  props: {
    value: String,
    uploadName: String,
  },

  computed: {
    content: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },

  methods: {
    beforeUpload(file) {
      this.upload(file)
      return false
    },

    async upload(file) {
      if (!file) {
        return this.$Message.warning('请选择图片')
      }
      const filename = file.name.split('.').join(`_${new Date().getTime()}.`)
      const res = await this.$alioss.multipartUpload(
        uploadTypeMap.image.dir + this.uploadName + filename,
        file,
      )
      const url = res.url
      this.$refs.editor.handleUploadSuccess(url)
      return false
    },
  },
}
</script>

<style scoped></style>
