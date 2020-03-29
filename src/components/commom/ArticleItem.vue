<template>
  <Card class="article-item" :class="{ 'article-item-tip': tip }">
    <div
      class="source"
      :class="[getConstantItem('ARTICLE_SOURCE', article.source, 'code')]"
      v-if="article.source !== undefined"
    >
      {{ article.source | constantFilter('ARTICLE_SOURCE') }}
    </div>
    <div class="wrap">
      <div class="main">
        <div class="detail">
          <div class="extra" v-if="article.thumb && !tip">
            <div class="thumb" v-if="article.thumb">
              <img :src="article.thumb" alt="" />
            </div>
          </div>
          <div class="content">
            <h4 class="title">
              <Tooltip
                v-if="article.category"
                placement="right"
                max-width="200"
                :content="article.category.description || '暂无简介'"
              >
                <Avatar
                  class="category"
                  :src="article.category.extends | extendsFilter('image')"
                  v-if="findExtendsItem(article.category.extends, 'image')"
                  >{{ article.category.name }}</Avatar
                >
                <Avatar
                  class="category"
                  :style="{
                    color: findExtendsItem(article.category.extends, 'color'),
                    backgroundColor: findExtendsItem(
                      article.category.extends,
                      'background',
                    ),
                  }"
                  v-else
                  >{{ article.category.name.slice(0, 2) }}</Avatar
                >
              </Tooltip>
              <router-link
                :to="{ name: 'ArticleDetail', params: { id: article._id } }"
                >{{ article.title }}</router-link
              >
            </h4>
            <div class="tag-list" v-if="article.tag.length">
              <Tooltip
                max-width="200"
                v-for="tag in article.tag"
                :key="tag._id"
                placement="top"
                :content="tag.description || '暂无简介'"
                >{{ tag.name }}</Tooltip
              >
            </div>
            <div class="description">{{ article.description }}</div>
            <div class="meta">
              <Tag
                size="small"
                :color="article.state ? 'success' : 'warning'"
                >{{ ['未发布', '已发布'][article.state] }}</Tag
              >
              <ul class="meta-list">
                <li class="meta-item">
                  <Icon class="icon" type="md-eye"></Icon>
                  {{ article.meta.pvs }}
                </li>
                <Divider type="vertical"></Divider>
                <li class="meta-item">
                  <Icon class="icon" type="md-thumbs-up" />
                  {{ article.meta.ups }}
                </li>
                <Divider type="vertical" />
                <li class="meta-item">
                  <Icon class="icon" type="md-text" />
                  {{ article.meta.comments }}
                </li>
              </ul>
              <div class="time">
                <span
                  ><Icon wsize="14" type="md-time"/><Time
                    :time="article.createdAt"
                  ></Time
                ></span>
                <span
                  ><Icon wsize="14" type="md-create"/><Time
                    :time="article.updatedAt"
                  ></Time
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="action" v-if="!tip">
        <div
          class="action-item publish"
          :class="[article.state && 'publish-down']"
          @click="changeState(article, index)"
        >
          <span class="icon">
            <Icon
              size="12"
              :type="['md-trending-up', 'md-trending-down'][article.state]"
            />
          </span>
          <span class="label">{{ ['发布', '下线'][article.state] }}</span>
        </div>
        <div
          class="action-item edit"
          @click="
            $route.push({ name: 'ArticleDetail', params: { id: article._id } })
          "
        >
          <span class="icon">
            <Icon size="12" type="md-create" />
          </span>
          <span class="label">编辑</span>
        </div>
        <div
          class="action-item view"
          :href="this.config.SIZE + '/articles/' + article._id"
          target="_blank"
          v-if="article.state"
        >
          <span class="icon">
            <Icon size="12" type="md-eye" />
          </span>
          <span class="label">查看</span>
        </div>
        <div class="action-item delete" @click="deleteArticle(article, index)">
          <span class="icon">
            <Icon size="12" type="md-trash" />
          </span>
          <span class="label">删除</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    tip: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    deleteArticle(article) {
      this.$Modal.confirm({
        title: '提示',
        render: () => {
          const h = this.$createElement
          return h('p', {}, [
            '确认删除吗？',
            h('br'),
            h('b', `《${article.title}》`),
          ])
        },
        onOk: () => {
          this.$$emit('on-delete', article, this.index)
        },
      })
    },

    changeState(article) {
      this.$emit('on-change-state', article, 1 - article.state)
    },
  },
}
</script>

<style scoped>
.article-item {
  margin-bottom: 24px;
  overflow: hidden;
}
.article-item .source {
  position: absolute;
  top: -8px;
  right: -30px;
  width: 96px;
  height: 48px;
  line-height: 36px;
  padding: 12px 16px;
  transform: rotateZ(45deg);
  text-align: center;
  color: #fff;
  font-weight: bold;
}
.article-item .source.original {
  background-color: rgba(16, 142, 233, 0.3);
  color: #108ee9;
}
.article-item .source.reprint {
  background-color: rgba(245, 106, 0, 0.3);
  color: #f56a00;
}
.article-item .source.hybrid {
  background-color: rgba(245, 46, 127, 0.3);
  color: #f5317f;
}
.article-item .source.translate {
  background-color: rgba(115, 101, 230, 0.3);
  color: #7265e6;
}
.article-item .wrap {
  display: flex;
}
.article-item .main {
  flex: 1 0;
  display: flex;
  flex-direction: column;
}
.article-item .detail {
  display: flex;
}
.article-item .extra {
  flex: 0 0;
  margin-left: 24px;
}
.article-item .extra .thumb {
  width: 210px;
  max-height: 130px;
  overflow: hidden;
}
.article-item .extra .thumb img {
  width: 100%;
  max-height: 100%;
  border-radius: 4px;
}
.article-item .content {
  flex: 1 1;
}
.article-item .content .title {
  margin-bottom: 12px;
  font-size: 16px;
  line-height: 24px;
}
.article-item .content .title a {
  color: #515a6e;
}
.article-item .content .category {
  margin-right: 12px;
}
.article-item .content .tag-list {
  margin-bottom: 12px;
}
.article-item .content .description {
  margin-bottom: 12px;
  line-height: 22px;
  text-align: justify;
  color: #93999f;
  overflow: hidden;
}
.article-item .meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.article-item .meta > * {
  display: inline-block;
}
.article-item .meta .meta-list {
  flex: 1 1;
}
.article-item .meta .meta-item {
  display: inline-block;
  padding: 0 9px;
  color: #93999f;
}
.article-item .meta .meta-item .icon {
  margin-right: 2px;
}
.article-item .meta .time {
  color: #93999f;
}
.article-item .meta .time span {
  margin-left: 9px;
}
.article-item .meta .time > span {
  margin-left: 16px;
}
.article-item .action {
  flex: 0 0 150px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  margin: 0 48px;
}
.article-item .action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 56px;
  height: 56px;
  margin: 8px;
  padding: 8px;
  font-size: 12px;
  text-align: center;
  background-color: #fff;
  color: #515a6e;
  border-radius: 8px;
  box-shadow: 0 0 40px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.article-item .action-item .icon {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-bottom: 4px;
  border-radius: 50%;
  color: #fff;
}
.article-item .action-item.publish .icon {
  background-color: #06c1ae;
}
.article-item .action-item.publish-down .icon {
  background-color: #f56a00;
}
.article-item .action-item.edit .icon {
  background-color: #54adf3;
}
.article-item .action-item.view .icon {
  background-color: #333d48;
}
.article-item .action-item.delete .icon {
  background-color: #ff485a;
}
.article-item .action-item:hover {
  box-shadow: 0 0 50px 2px rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}
</style>
