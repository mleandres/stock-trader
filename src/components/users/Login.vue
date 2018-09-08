<template>
  <div id="login">
    <div class="login-form">
      <h2>Log In</h2>
      <form @submit.prevent="submit">
        <div class="input">
          <label for="email">Your Email:</label>
          <input
            autofocus
            type="email"
            id="email"
            autocomplete="email"
            v-model="email">
        </div>
        <div class="input">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            autocomplete="new-password"
            v-model="password">
        </div>
        <div class="submit">
          <button class="btn btn-default" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    submit () {
      const userData = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('login', userData)
    }
  },
  mounted () {
    document.title = "Log in"
  }
}
</script>

<style scoped>
#login {
  height: 100%;
}

.login-form {
  border: #888 solid 2px;
  border-radius: 0.5em;
  padding: 0.5em 2em;
  box-shadow: 1px 2px #ccc;
}

.input {
  position: relative;
}

.input label {
  display: block;
}

.input input {
  width: 50%;
}

.input, h2, .submit {
  margin: 1em;
}

</style>
