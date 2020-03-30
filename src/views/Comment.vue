<template>
  <Container class="comment-page" :title="$route.meta.title">
    <Avatar
      slot="logo"
      :icon="$route.meta.icon"
      style="color: #f04134; background-color: #fcdbd9;"
    ></Avatar>
    <Alert show-icon :type="current.pageInfo.total ? 'info' : 'warning'">
      共找到 <b style="color: #ff8d13">{{ current.pageInfo.total }}</b> 条{{
        current.title
      }}
    </Alert>

    <Card>
      <Tabs v-model="curTab" @on-click="tabChange">
        <TabPane
          :label="type.label"
          :name="type.type"
          v-for="type in constant.COMMENT_TYPE"
          :key="type.value"
        >
          {{ type.label }}
          <div class="pager">
            <Page
              :current="current.pageInfo.current"
              :total="current.pageInfo.total"
              show-total
              @on-change="pageChange"
            ></Page>
          </div>
          <Table
            :columns="columns"
            :data="current.list"
            :loading="current.loading"
          ></Table>
          <div class="pager">
            <Page
              :current="current.pageInfo.current"
              :total="current.pageInfo.total"
              show-total
              @on-change="pageChange"
            ></Page>
          </div>
        </TabPane>
      </Tabs>
    </Card>

    <Modal
      class="reply-dialog"
      width="500"
      :title="'回复' + current.title"
      v-model="dialogVisible"
      :mask-closable="false"
      @on-cancel="close"
    >
      <div class="origin-content" v-if="replyTarget">
        <div class="i-editor-md" v-html="replyTarget.renderedContent"></div>
      </div>
      <Editor
        v-model="replyContent"
        :update-name="config.UPLOAD_NAME.COMMENT"
        :autosize="{ minRows: 10 }"
        placeholder="请输入回复内容"
        write-name="回复内容"
      ></Editor>
      <div slot="footer">
        <Button type="primary" long :loading="replyLoading" @click="replySubmit"
          >回复</Button
        >
      </div>
    </Modal>

    <Modal
      class="update-dialog"
      width="400"
      title="修改评论状态"
      v-model="updateDialogVisible"
      :mask-closable="false"
      @on-cancel="close"
    >
      <Form
        ref="from"
        :label-width="60"
        :model="updateTarget"
        v-if="updateTarget"
      >
        <FormItem label="状态" prop="name">
          <RadioGroup
            v-model="updateTarget.state"
            type="button"
            style="min-width: 200px"
          >
            <Radio
              v-for="item in constant.COMMENT_STATE"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</Radio
            >
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align: center;">
        <Button
          type="primary"
          :loading="updateLoading"
          @click="updateStateSubmit"
          >提交</Button
        >
        <Button type="default" @click="close">取消</Button>
      </div>
    </Modal>
  </Container>
</template>

<script>
import { cloneDeep } from 'lodash'
import Container from '../components/commom/Container'
import Editor from '../components/commom/Editor'

export default {
  name: 'Comment',
  components: {
    Container,
    Editor,
  },
  data() {
    return {
      curTab: 'comment',
      dialogVisible: false,
      replyTarget: null,
      replyContent: '',
      replyLoading: false,
      updateDialogVisible: false,
      updateTarget: null,
      updateLoading: false,
    }
  },

  computed: {
    current() {
      return this.data[this.curTab]
    },

    columns() {
      const columns = [
        {
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: '内容',
          key: 'content',
          width: 250,
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  padding: '16px 0',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  '-webkit-line-clamp': '3',
                  '-webkit-box-orient': 'vertical',
                },
              },
              params.row.content,
            )
          },
        },
        {
          title: '发布人',
          key: 'author',
          width: 200,
          render: (h, params) => {
            const itemMargin = '8px 0'
            return h(
              'div',
              {
                style: {
                  padding: '16px 0',
                },
              },
              [
                h(
                  'p',
                  {
                    style: {
                      margin: itemMargin,
                      fontWeight: 'bold',
                    },
                  },
                  [
                    h('Avatar', {
                      props: {
                        size: 'small',
                        src: params.row.author.avatar,
                      },
                      style: {
                        marginRight: '8px',
                      },
                    }),
                    params.row.author.name,
                  ],
                ),
                h(
                  'p',
                  {
                    style: {
                      margin: itemMargin,
                    },
                  },
                  params.row.author.email,
                ),
                params.row.author.site &&
                  h(
                    'p',
                    {
                      style: {
                        margin: itemMargin,
                      },
                    },
                    params.row.author.site,
                  ),
              ],
            )
          },
        },
        {
          title: '类型',
          width: 120,
          render: (h, params) => {
            return h('span', null, params.row.forward ? '回复' : '评论')
          },
        },
        {
          title: '状态',
          key: 'state',
          width: 120,
          render: (h, params) => {
            const find = this.getConstantItem('COMMENT_STATE', params.row.state)
            return h(
              'Tag',
              {
                props: {
                  type: 'border',
                  color: find.color,
                },
              },
              find.label,
            )
          },
        },
        {
          title: '点赞数',
          key: 'ups',
          width: 80,
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
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const renderBtn = (text, type, handler) => {
              return h(
                'Button',
                {
                  props: {
                    type: type || 'default',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      handler(params.index, params.row)
                    },
                  },
                },
                text,
              )
            }
            return h('div', [
              renderBtn('修改', 'default', this.updateState),
              renderBtn('回复', 'primary', this.reply),
            ])
          },
        },
      ]
      if (this.curTab === 'comment') {
        columns.splice(-1, 0, {
          title: '所属文章',
          key: 'article',
          render: (h, params) => {
            return h(
              'router-link',
              {
                props: {
                  to: `/articles/${params.row.article._id}`,
                },
              },
              params.row.article.title,
            )
          },
        })
      }
      return columns
    },
  },

  created() {
    this.getList()
  },

  methods: {
    async getList(page = 1) {
      const cur = this.curTab
      const { loading, query } = this.data[this.curTab]
      if (loading) return
      this.data[cur].loading = true
      const res = await this.api.comment.list({ ...query, page })
      this.data[cur].loading = false
      if (res.success) {
        this.data[cur] = { ...this.data[cur], ...res.data }
      }
    },

    async update(id, payload) {
      if (this.updateLoading) return
      this.updateLoading = true
      const res = await this.api.comment.update(id, payload)
      this.updateLoading = false
      if (res.success) {
        this.$Message.success(res.message)
      }
      return res.success
    },

    tabChange() {
      this.$nextTick(() => this.getList())
    },

    pageChange(page) {
      this.getList(page)
    },

    updateState(index, item) {
      this.updateTarget = cloneDeep(item)
      this.updateDialogVisible = true
    },

    async updateStateSubmit() {
      const success = await this.update(this.updateTarget._id, {
        state: this.updateTarget.state,
      })
      if (success) {
        this.close()
        this.getList(this.current.pageInfo.current)
      }
    },

    reply(index, item) {
      this.dialogVisible = true
      this.replyTarget = item
    },

    getPayload() {
      const payload = {
        content: this.replyContent,
        author: this.admin._id,
        type: this.replyTarget.type,
        forward: this.replyTarget._id,
      }
      if (this.replyTarget.article) {
        payload.article = this.replyTarget.article._id
      }
      if (this.replyTarget.parent) {
        payload.parent = this.replyTarget.parent._id
      } else {
        payload.parent = this.replyTarget._id
      }
      return payload
    },

    async replySubmit() {
      const res = await this.api.comment.create(this.getPayload())
      if (res.success) {
        this.$Message.success(res.success)
        this.close()
        this.getList()
      }
    },

    close() {
      this.dialogVisible = false
      this.updateDialogVisible = false
      this.replyTarget = null
      this.replyContent = ''
      this.updateTarget = null
    },
  },
}
</script>

<style scoped>
.comment-page .pager {
  margin: 12px 0;
  text-align: right;
}
</style>
