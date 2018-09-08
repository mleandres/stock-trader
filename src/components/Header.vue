<template>
  <nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <router-link to="/" class="navbar-brand">Stock Trader</router-link>
    </div>
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <router-link
          v-if="auth"
          to="/portfolio" 
          activeClass="active" 
          tag="li">
          <a>Portfolio</a>
        </router-link>
        <router-link
          v-if="auth"
          to="/stocks" 
          activeClass="active" 
          tag="li">
          <a>Stocks</a>
        </router-link>
      </ul>
      <!--
      <form class="navbar-form navbar-left">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Search">
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
      -->
      <strong v-if="auth" class="nav navbar-text navbar-right">Your Cash Balance: {{ balance | currency }}</strong>
      <ul class="nav navbar-nav navbar-right">
        <li v-if="auth">
          <a href="#" @click="endDay">End Day</a>
        </li>
        <li v-if="auth"
            class="dropdown" 
            :class="{ open: dropdownOpen }" 
            @click="toggleDropdown">
          <a href="#"
             class="dropdown-toggle" 
             data-toggle="dropdown" 
             role="button" 
             aria-haspopup="true"
             aria-expanded="false">Options<span class="caret"></span></a>
          <ul class="dropdown-menu">
            <router-link
              to="/settings"
              tag="li">
              <a href="#">Settings</a>
            </router-link>
            <li><a href="#" @click="logout">Log Out</a></li>
          </ul>
        </li>
        <router-link
          v-if="!auth"
          to="/login"
          tag="li">
          <a>Log In</a>
        </router-link>
        <router-link
          v-if="!auth"
          to="/signup"
          tag="li">
          <a>Sign Up</a>
        </router-link>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
</template>

<script>
export default {
  data () {
    return {
      dropdownOpen: false
    }
  },
  computed: {
    balance () {
      return this.$store.getters['portfolio/getBalance']
    },
    auth () {
      return this.$store.getters.token !== null
    }
  },
  methods: {
    endDay () {
      this.$store.dispatch('stocks/randomizeStocks')
    },
    toggleDropdown () {
      return this.dropdownOpen = !this.dropdownOpen
    },
    saveData () {
      if (this.auth) {
        this.$store.dispatch('saveData')
      } else {
        // should go to sign up
        this.$router.push('/signup')
      }
    },
    loadData () {
      if (this.auth) {
        this.$store.dispatch('loadData')
      } else {
        // should go to log in
        this.$router.push('/login')
      }
    },
    logout () {
      if (this.auth) {
        this.$store.dispatch('logout')
      }
    }
  }
}
</script>

<style>

</style>
