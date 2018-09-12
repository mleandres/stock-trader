<template>
  <div id="home">
    <div class="info">
      <h1>Welcome {{ welcomeMessage }}</h1>
      <h4>This fun project allows you to simulate the thrill of trading stocks or viewing your portfolio but without the hassle of actually making or losing any money.</h4>
      <ol>
        <li>First sign up or log in <em>(or use demo mode but your data won't be saved)</em>.</li>
        <li>After logging in, buy stocks from the stock tab</li>
        <li>Click 'End Day' to simulate the next stock market day.</li>
        <li>Sell your stocks in the portfolio tab.</li>
        <li>Your Data will be automatically saved when you buy or sell a stock or end the day</li>
      </ol>
      <hr>
      <p v-if="auth">Your Cash Balance: {{ balance | currency }}</p>
      <button
        v-if="!auth"
        @click="initDemo"
        class="button-large main-button">Demo Mode
      </button>
      <router-link tag="button"
                  v-if="!auth"
                  href="#"
                  to="/login"
                  class="button-large secondary-button">Log in
      </router-link>
      <router-link tag="button"
                  v-if="!auth"
                  href="#"
                  to="/signup"
                  class="button-large secondary-button">Sign Up
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    balance () {
      return this.$store.getters['portfolio/getBalance']
    },
    auth () {
      return this.$store.getters.token !== null
    },
    welcomeMessage () {
      if (!this.auth) {
        return "to Stock Trader!"
      }
      else {
        const name = this.$store.state.users.username
        return (name ? name: 'you') + '!'
      }
    }
  },
  mounted () {
    document.title = "Welcome!"
  },
  methods: {
    initDemo () {
      this.$store.dispatch('initDemo')
    }
  }
}
</script>

<style>

</style>
