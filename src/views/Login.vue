<template>
  <div class="login-page">
    <Background></Background>
    <div class="wrap">
      <div class="content">
        <div class="top"></div>
        <div class="main">
          <Form ref="form" :model="model" :rules="ruleValidate">
            <FormItem prop="username">
              <Input
                type="text"
                prefix="md-contact"
                placeholder="请输入登录名"
                v-model.trim="model.username"
                @on-enter="submit"
              />
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                prefix="md-key"
                placeholder="请输入密码"
                v-model.trim="model.password"
                @on-enter="submit"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" long @click="submit">登录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Background from '../components/commom/Background'

export default {
  name: 'Login',
  components: {
    Background,
  },
  data() {
    return {
      model: {
        username: '',
        password: '',
      },
      ruleValidate: {
        username: [{ required: true, message: '请填写登录名' }],
        password: [{ required: true, message: '请填写密码' }],
      },
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const success = await this.$store.dispatch('auth/login', this.model)
          if (success) {
            const query = this.$route.query
            this.$router.push({
              name: query.redirect_uri_name || 'Dashboard',
              params: JSON.parse(query.redirect_params || '{}'),
              query: JSON.parse(query.redirect_query || '{}'),
            })
          }
        }
      })
    },
  },
}
</script>

<style scoped>
.login-page .wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
}
.login-page .content {
  flex: 1 1;
  padding: 250px 0 24px;
  text-align: center;
}
.login-page .content .main {
  width: 320px;
  margin: 0 auto;
}
</style>
