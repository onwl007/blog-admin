<template>
  <Container class="moment-page" :title="$route.meta.title">
    <Avatar
      slot="logo"
      :icon="$route.meta.icon"
      style="color: #f04134; background-color: #fcbd9;"
    ></Avatar>
    <Input
      slot="action"
      search
      enter-button="搜索"
      placeholder="搜索说说"
      style="width: 300px"
      v-model.trim="query.keyword"
      @on-search="search"
      @on-enter="search"
    />
    <Alert show-icon :type="pageInfo.total ? 'info' : 'warning'">
      共找到 <b style="color: #ff8d13">{{ pageInfo.total }}</b> 条说说
    </Alert>
    <Button icon="md-add" type="dashed" long class="add-moment-btn" @click="add"
      >新建说说</Button
    >
    <Table :columns="columns" :data="list" :loading="loading"></Table>
    <div class="pager">
      <Page :total="pageInfo.total" @on-change="pageChange"></Page>
    </div>

    <Modal
      class="moment-dialog"
      width="500"
      :title="title"
      v-model="dialogVisible"
      :mask-closable="false"
    >
      <Form ref="form" :label-width="60" :model="curMoment" :rules="rule">
        <FormItem label="内容" prop="content">
          <Input
            type="textarea"
            v-model="curMoment.content"
            placeholder="请填写内容"
          ></Input>
        </FormItem>
      </Form>
      <div class="action" slot="footer">
        <Button type="primary" @click="submit">提交</Button>
        <Button @click="dialogVisible = false">取消</Button>
      </div>
    </Modal>
  </Container>
</template>

<script>
import { cloneDeep } from 'lodash'
import Container from '../components/commom/Container'

export default {
  name: 'Moment',
  components: {
    Container,
  },
  data() {
    return {
      query: {
        keyword: '',
      },
      loading: false,
      list: [],
      pageInfo: {
        total: 0,
        current: 1,
        pages: 10,
        limit: 10,
      },
      dialogVisible: false,
      curMoment: {},
    }
  },

  computed: {
    title() {
      return this.curMoment._id ? '编辑说说' : '创建说说'
    },

    rule() {
      return {
        content: [{ required: true, message: '说说内容必填' }],
      }
    },

    columns() {
      return [
        { type: 'index', width: 60, align: 'center' },
        { title: '内容', key: 'content' },
        {
          title: '发表地点',
          key: 'location',
          render: (h, params) => {
            const { country, area, city } = params.row.location
            return h('span', null, [country, area, city].join('-'))
          },
        },
        {
          title: '发表时间',
          key: 'createdAt',
          render: (h, params) => {
            return h('Time', {
              props: {
                time: params.row.createdAt,
                type: 'datetime',
              },
            })
          },
        },
        {
          title: '修改时间',
          key: 'updatedAt',
          render: (h, params) => {
            return h('Time', {
              props: {
                time: params.row.updatedAt,
                type: 'datetime',
              },
            })
          },
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    },
                  },
                },
                '编辑',
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.deleteItem(params.row)
                    },
                  },
                },
                '删除',
              ),
            ])
          },
        },
      ]
    },
  },

  watch: {
    dialogVisible(val) {
      if (!val) {
        this.curMoment = {}
      }
    },
  },

  created() {
    this.search()
  },

  methods: {
    async search(page = 1) {
      if (this.loading) return
      try {
        this.loading = true
        const params = {
          ...this.query,
          page: (this.pageInfo.current = Number(page) || 1),
          limit: this.pageInfo.limit,
        }
        // const res = await this.api.moment.list(params)
        const res = {}
        this.loading = false
        this.list = res.data.list
        this.pageInfo = res.data.pageInfo
      } catch (error) {
        this.loading = false
      }
    },

    pageChange(page) {
      this.search()
    },

    add() {
      this.dialogVisible = true
    },

    edit(item) {
      this.dialogVisible = true
      this.curMoment = cloneDeep(item)
    },

    deleteItem(item) {
      this.$Modal.confirm({
        title: '提示',
        render: () => {
          const h = this.$createElement
          return h('p', {}, ['确认删除吗？'])
        },
        onOk: async () => {
          // const res = await this.api.moment.deleteItem(item._id)
          const res = { message: '删除成功' }
          this.$Message.success(res.message)
          await this.search(this.pageInfo.current)
        },
      })
    },

    async submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        let res
        if (this.curMoment._id) {
          res = await this.api.moment.update(this.curMoment._id, this.curMoment)
        } else {
          res = await this.api.moment.create(this.curMoment)
        }
        if (res) {
          this.$Message.success(res.message)
          this.dialogVisible = false
          this.search(this.pageInfo.current)
        }
      })
    },
  },
}
</script>

<style scoped>
.moment-page .add-moment-btn {
  margin-bottom: 16px;
  font-size: 16px;
}
.moment-page .pager {
  margin: 16px 0;
  text-align: right;
}
</style>
