<template>
  <div class="container">
    <div
      class="header"
      v-if="
        hasLogoSlots || log || hasTitleSlots || hasDescSlots || title || desc
      "
    >
      <div class="logo" v-if="hasLogoSlots || logo">
        <Icon :type="logo" size="28" v-if="logo"></Icon>
        <slot name="logo" v-else></slot>
      </div>
      <div class="detail" v-if="hasTitleSlots || hasDescSlots || title || desc">
        <div class="row">
          <h1 class="title" v-if="!hasTitleSlots && title">{{ title }}</h1>
          <slot class="title" name="title" v-else></slot>
          <div class="action" v-if="hasActionSlots">
            <slot name="action"></slot>
          </div>
        </div>
        <div class="row desc" v-if="hasDescSlots || desc">
          <p v-if="desc">{{ desc }}</p>
          <slot name="desc" v-else></slot>
        </div>
      </div>
    </div>
    <div class="content">
      <Card v-if="hasFilterSlots" class="filter">
        <slot name="filter"></slot>
      </Card>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Container',

  props: {
    logo: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },

  computed: {
    hasTitleSlots() {
      return this.getNamedSlotsExist('title')
    },

    hasLogoSlots() {
      return this.getNamedSlotsExist('logo')
    },

    hasActionSlots() {
      return this.getNamedSlotsExist('action')
    },

    hasDescSlots() {
      return this.getNamedSlotsExist('desc')
    },

    hasFilterSlots() {
      return this.getNamedSlotsExist('filter')
    },
  },

  methods: {
    getNamedSlotsExist(name) {
      const slots = this.$slots[name]
      return Boolean(slots && slots.length)
    },
  },
}
</script>

<style scoped>
.container {
  margin: -24px -24px 0;
}
.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  display: flex;
  justify-content: space-between;
  padding: 16px 32px 0;
  z-index: 966;
  background-color: #fff;
  border-bottom: 1px solid #e9eaec;
}
.logo {
  margin-right: 16px;
}
.detail {
  width: 100%;
}
.detail .row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.detail .title {
  font-size: 20px;
  text-overflow: ellipsis;
}
.detail .action {
  margin-left: 48px;
}
.container .content {
  margin: 24px;
  margin-top: 89px;
}
.container .content .filter {
  margin-bottom: 16px;
}
</style>
