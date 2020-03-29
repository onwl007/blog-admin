<template>
  <Container class="tag-page" :title="$route.meta.title">
    <Avatar
      slot="logo"
      :icon="$route.meta.icon"
      style="color: #d3adf7; background-color: #f9f0ff;"
    ></Avatar>
    <Input
      slot="action"
      search
      enter-button="搜索"
      placeholder="搜索标签"
      style="width: 300px"
      v-model.trim="query.keyword"
      @on-search="search"
      @on-enter="search"
    />
    <Alert show-icon :type="tList.length ? 'info' : 'warning'">
      共找到 <b style="color: #ff8d13">{{ tList.length }}</b> 个标签
    </Alert>
    <Row :gutter="16" class="tag-list">
      <Col v-bind="colResponsiveProps">
        <Button icon="md-add" type="dashed" class="create-btn" @click="add"
          >添加标签</Button
        >
      </Col>
      <Col
        v-bind="colResponsiveProps"
        v-for="item in tList"
        :key="item._id"
        class="tag-item"
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
              <span
                ><a
                  ><Icon
                    type="ios-create-outline"
                    size="18"
                    class="action-icon"
                    @click="edit(item)"
                  ></Icon></a
              ></span>
            </li>
            <li class="action-item">
              <span
                ><a
                  ><Icon
                    type="ios-trash-outline"
                    size="18"
                    class="action-icon"
                    @click="deleteItem(item)"
                  ></Icon></a
              ></span>
            </li>
          </ul>
        </Card>
      </Col>
    </Row>
    <CTDialog
      v-model="ctDialogVisible"
      type="tag"
      :id="(curTag && curTag._id) || ''"
    ></CTDialog>
  </Container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Container from '../components/commom/Container'
import CTDialog from '../components/commom/CTDialog'

export default {
  name: 'Tag',
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
      curTag: null,
    }
  },

  created() {
    this.search()
  },

  watch: {
    ctDialogVisible(val) {
      if (!val) {
        this.curTag = null
      }
    },
  },

  computed: {
    ...mapGetters('tag', {
      tList: 'list',
      tLoading: 'loading',
    }),
  },

  methods: {
    ...mapActions('tag', {
      getTList: 'getList',
      deleteTItem: 'deleteItem',
    }),

    async search() {
      await this.getTList(this.query)
    },

    add() {
      this.ctDialogVisible = true
    },

    edit(item) {
      this.ctDialogVisible = true
      this.curTag = item
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
          await this.deleteTItem(item._id)
          await this.getTList()
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
.tag-item {
  margin-bottom: 12px;
}
.action {
  display: flex;
  margin: 0 -16px -16px;
  border-top: 1px solid #e9eaec;
}
.action-item {
  flex: 1 1;
  margin: 12px 0;
  text-align: center;
}
.action-item:not(:last-child) {
  border-right: 1px solid #e9eaec;
}
.action-icon {
  color: rgba(0, 0, 0, 0.45);
}
.action-icon:hover {
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
