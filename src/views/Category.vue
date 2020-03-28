<template>
  <Container class="category-page" :title="$route.meta.title">
    <Avatar
      slot="logo"
      :icon="$route.meta.icon"
      style="color: #f56a00;background-color: #fde3cf"
    ></Avatar>
    <Input
      slot="action"
      search
      enter-button="搜索"
      placeholder="搜索分类"
      style="width: 300px"
      v-model.trim="query.keyword"
      @on-search="search"
      @on-enter="search"
    />
    <Alert show-icon :type="cList.length ? 'info' : 'warning'">
      共找到 <b style="color: #FF8D13">{{ cList.length }}</b> 个分类
    </Alert>
    <Row :gutter="16" class="category-list">
      <Col v-bind="colResponsiveProps" class="category-item">
        <Button icon="md-add" type="dashed" class="create-btn" @click="add"
          >添加分类</Button
        >
      </Col>
      <Col
        v-bind="colResponsiveProps"
        v-for="item in cList"
        :key="item._id"
        class="category-item"
      >
        <Card :title="item.name" :icon="findExtendsItem(item.extends, 'icon')">
          <Avatar
            slot="extra"
            size="small"
            :src="item.extends | extendsFilter('image')"
            v-if="findExtendsItem(item.extends, 'image')"
            >{{ item.name }}</Avatar
          >
          <Avatar
            slot="extra"
            size="small"
            :style="{
              color: findExtendsItem(item.extends, 'color'),
              backgroundColor: findExtendsItem(item.extends, 'background'),
            }"
            v-else
            >{{ item.name.slice(0, 2) }}</Avatar
          >
          <div class="content">
            <p class="description">{{ item.description }}</p>
            <div class="count">
              <p>关联文章</p>
              <p>{{ item.count }}</p>
            </div>
          </div>
          <ul class="action">
            <li class="action-item">
              <Tooltip placement="top" content="编辑">
                <span
                  ><a
                    ><Icon
                      type="ios-create-outline"
                      size="20"
                      class="action-icon"
                      @click="edit(item)"
                    ></Icon></a
                ></span>
              </Tooltip>
            </li>
            <li class="action-item">
              <Tooltip placement="top" content="删除">
                <span
                  ><a
                    ><Icon
                      type="ios-trash-outline"
                      size="20"
                      class="action-icon"
                      @click="deleteItem(item)"
                    ></Icon></a
                ></span>
              </Tooltip>
            </li>
          </ul>
        </Card>
      </Col>
    </Row>
    <CTDialog
      v-model="ctDialogVisible"
      type="category"
      :id="(curCategory && curCategory._id) || ''"
    ></CTDialog>
  </Container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Container from '../components/commom/Container'
import CTDialog from '../components/commom/CTDialog'

export default {
  name: 'Category',
  components: {
    Container,
    CTDialog,
  },
  data() {
    return {
      colResponsiveProps: {
        xs: 24,
        sm: 12,
        md: 12,
        lg: 6,
      },
      query: {
        keyword: '',
      },
      ctDialogVisible: false,
      curCategory: null,
    }
  },

  created() {
    this.search()
  },

  watch: {
    ctDialogVisibile(val) {
      if (!val) {
        this.curCategory = null
      }
    },
  },

  computed: {
    ...mapGetters('category', { cList: 'list', cLoading: 'loading' }),
  },

  methods: {
    ...mapActions('category', {
      getCList: 'getList',
      deleteCItem: 'deleteItem',
    }),

    async search() {
      await this.getCList(this.query)
    },

    add() {
      this.ctDialogVisible = true
    },

    edit(item) {
      this.ctDialogVisible = true
      this.curCategory = item
    },

    deleteItem(item) {
      this.$Modal.confirm({
        title: '提示',
        render: () => {
          const h = this.$createElement
          return h('p', {}, [
            '确认删除吗？',
            h('br'),
            h('b', `《${item.name}》`),
          ])
        },
        onOk: async () => {
          await this.deleteCItem(item._id)
          await this.getCList()
        },
      })
    },
  },
}
</script>

<style scoped>
.create-btn {
  width: 100%;
  height: 186px;
  font-size: 14px;
}
.category-item {
  margin-bottom: 12px;
}
.action {
  display: flex;
  margin: 0 -16px -16px;
  border-top: 1px solid #e9eaec;
}
.action .action-item {
  flex: 1 1;
  margin: 12px 0;
}
.action .action-item:not(:last-child) {
  border-right: 1px solid #e9eaec;
}
.action .action-item .action-icon {
  color: rgba(0, 0, 0, 0.45);
}
.action .action-item .action-icon:hover {
  color: #2d8cf0;
}
.content {
  display: flex;
  margin-bottom: 16px;
}
.content .description {
  flex: 1 1;
  height: 40px;
  overflow: hidden;
}
.content .count {
  flex: 0 0 50px;
  margin-left: 12px;
}
.content .count p {
  color: #93999f;
  font-size: 12px;
  margin-bottom: 4px;
  text-align: center;
}
.content .count p:last-child {
  color: #515a6e;
  font-size: 24px;
  margin: 0;
}
</style>
