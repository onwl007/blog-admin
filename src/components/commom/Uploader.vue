<template>
  <div class="uploader">
    <Upload
      action=""
      :show-upload-list="false"
      :accept="accept"
      :before-upload="beforeUpload"
    >
      <Button
        type="primary"
        :size="size"
        icon="md-cloud-upload"
        :loading="uploading"
        >{{ url ? '更换' : '上传' }}</Button
      >
    </Upload>
  </div>
</template>

<script>
export const uploadTypeMap = {
  file: {
    accept: '',
    text: '文件',
    dir: 'file/',
  },
  image: {
    accept: 'image/*',
    text: '图片',
    dir: 'img/',
  },
}

export default {
  name: 'Uploader',
  props: {
    name: {
      type: String,
      default: new Date().getTime().toString(),
    },
    url: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'file',
    },
    size: {
      type: String,
      default: 'default',
    },
  },

  data() {
    return {
      file: null,
      uploading: false,
      typeMap: uploadTypeMap,
    }
  },

  computed: {
    accept() {
      return this.typeMap[this.type].accept
    },
  },

  methods: {
    beforeUpload(file) {
      this.file = file
      this.upload()
      return false
    },

    async upload() {
      if (this.uploading) return
      if (!this.file) {
        return this.$Message.warning(`请选择${this.typeMap[this.type].text}`)
      }
      this.uploading = true
      const filename = this.file.name
        .split('.')
        .join(`_${new Date().getTime()}`)
      const res = await this.$alioss.multipartUpload(
        this.typeMap[this.type].dir + this.name + filename,
        this.file,
      )
      this.uploading = false
      this.$emit('on-success', res.url)
    },
  },
}
</script>

<style scoped>
.uploader {
  display: inline-block;
}
.uploader .upload-img-wrapper {
  margin-bottom: 12px;
}
.uploader .upload-img-wrapper .img {
  max-width: 100%;
  cursor: pointer;
}
</style>
