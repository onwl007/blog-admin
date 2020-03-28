<template>
  <Modal
    class="ct-dialog"
    width="500"
    :title="title"
    v-model="visible"
    v-bind="$attrs"
    v-on="$listeners"
    :mask-closable="false"
  >
    <Form ref="form" :label-width="60" :model="model" :rules="rule">
      <FormItem label="名称" prop="name">
        <Input v-model="model.name" placeholder="请填写名称"></Input>
      </FormItem>
      <FormItem label="描述">
        <Input
          type="textarea"
          v-model="model.description"
          placeholder="请填写描述"
        ></Input>
      </FormItem>
      <FormItem label="扩展项" prop="extends">
        <Row
          style="margin-bottom: 8px"
          type="flex"
          :gutter="8"
          v-for="(ext, index) in model.extends"
          :key="index"
        >
          <Col span="4">
            <Input v-model="ext.key" placeholder="扩展项Key"></Input>
          </Col>
          <Col span="10">
            <Input v-model="ext.value" placeholder="扩展项Value"></Input>
          </Col>
          <Col span="9">
            <Uploader
              v-if="ext.key === 'image'"
              style="margin-right: 8px;"
              type="image"
              :name="config.UPLOAD_NAME.CATEGORY"
              :url="ext.value"
              @on-success="url => uploadSuccess(index, url)"
            ></Uploader>
            <Button type="error" @click="deleteExt(ext, index)">删除</Button>
          </Col>
        </Row>
        <Button
          long
          icon="md-add"
          type="dashed"
          class="ext-add-btn"
          @click="addExt"
          >添加扩展</Button
        >
      </FormItem>
    </Form>
    <div class="action" slot="footer">
      <Button type="primary" @click="submit">提交</Button>
      <Button @click="visible = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { cloneDeep } from 'lodash'

const getDefExt = () => ({
  key: '',
  value: '',
})

const getDefMod = () => ({
  name: '',
  description: '',
  extends: [],
})

export default {
  name: 'Dialog',

  props: {
    value: Boolean,
    type: {
      type: String,
      validator(val) {
        return ['category', 'tag'].includes(val)
      },
    },
    id: String,
  },

  data() {
    return {
      visible: false,
      model: getDefMod(),
    }
  },

  computed: {
    ...mapGetters('category', { cList: 'list' }),

    ...mapGetters('tag', { tList: 'list' }),

    rule() {
      const extValidator = (rule, value, callback) => {
        if (!value.every(({ key, value }) => key && value)) {
          callback(new Error('扩展项信息请填写完整'))
        } else {
          callback()
        }
      }
      return {
        name: [{ required: true, message: '名称必填' }],
        extends: [{ validator: extValidator }],
      }
    },

    title() {
      return this.id
        ? '编辑'
        : '创建' +
            {
              category: '分类',
              tag: '标签',
            }[this.type] || ''
    },
  },

  watch: {
    value(val, oldVal) {
      if (val !== oldVal) {
        this.visible = val
      }
    },

    visible(val, oldVal) {
      if (val === oldVal) return
      this.$emit('input', val)
      if (!val) {
        setTimeout(() => this.clearModel(), 500)
      } else {
        if (this.id) {
          this.getModel()
        } else if (this.type === 'category') {
          this.model.extends.push({
            key: 'image',
            value: '',
          })
        }
      }
    },
  },
  methods: {
    ...mapActions('category', {
      updateCItem: 'update',
      createCItem: 'create',
      getCList: 'getList',
    }),

    ...mapActions('tag', {
      updateTItem: 'update',
      createTItem: 'create',
      getTList: 'getList',
    }),

    deleteExt(ext, index) {
      this.model.extends.splice(index, 1)
    },

    addExt() {
      this.model.extends.push(getDefExt())
    },

    getModel() {
      const hit = this[{ category: 'cList', tag: 'tList' }[this.type]].find(
        item => item._id === this.id,
      )
      if (hit) {
        this.model = cloneDeep(hit)
      }
    },

    clearModel() {
      this.model = getDefMod()
    },

    uploadSuccess(index, url) {
      this.model.extends[index].val = url
    },

    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const success = await this[
          {
            category: this.id ? 'updateCItem' : 'createCItem',
            tag: this.id ? 'updateTItem' : 'createTItem',
          }[this.type]
        ](this.id ? { id: this.id, payload: this.model } : this.model)
        if (success) {
          this.visible = false
          this[{ category: 'getCList', tag: 'getTList' }[this.type]]()
        }
      })
    },
  },
}
</script>

<style scoped>
.ct-dialog .action {
  text-align: center;
}
</style>
