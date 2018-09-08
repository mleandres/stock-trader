<template>
  <div id="app">
    <div class="container">
      <app-header></app-header>
    </div>
    <div class="main">
      <transition :name="slide" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <app-footer class="footer"></app-footer>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Home from './components/Home.vue'
import Portfolio from './components/portfolio/Portfolio.vue'
import Stocks from './components/stocks/Stocks.vue'
import Settings from './components/settings/Settings.vue'

export default {
  components: {
    appHeader: Header,
    appFooter: Footer,
    appHome: Home,
    appPortfolio: Portfolio,
    appStocks: Stocks
  },
  created () {
    this.$store.dispatch('stocks/initStocks')
    this.$store.dispatch('resumeSession')
  },
  computed: {
    slide () {
      const curRoute = this.$store.getters.getCurrentRoute
      const lastRoute = this.$store.getters.getLastRoute
      return (lastRoute > curRoute ? 'slide-left' : 'slide-right')
    }
  }
}
</script>

<style>
body, html {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

body {
  padding: 1em;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
.slide-right-enter-active {
  animation: slide-right-in 200ms ease-out forwards;
}
.slide-right-leave-active {
  animation: slide-right-out 200ms ease-out forwards;
}
@keyframes slide-right-in {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-right-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-30px);
    opacity: 0;
  }
}

.slide-left-enter-active {
  animation: slide-left-in 200ms ease-out forwards;
}
.slide-left-leave-active {
  animation: slide-left-out 200ms ease-out forwards;
}
@keyframes slide-left-in {
  from {
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-left-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(30px);
    opacity: 0;
  }
}

.slide-up-enter-active {
  animation: slide-up-in 200ms ease-out forwards;
}
.slide-up-leave-active {
  animation: slide-up-out 200ms ease-out forwards;
}
@keyframes slide-up-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slide-up-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(30px);
    opacity: 0;
  }
}

.container {
  grid-area: header;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}

@supports not (display: grid) {
  .container,
  .main,
  .footer {
    max-width: 50em;
  }
}

@supports (display: grid) {
  @media screen and (min-width: 800px) {
  	#app {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      grid-template-rows: auto;
      grid-template-areas:
        "header header header"
        "space-left main space-right"
        "footer footer footer";
    }
  }

  @media screen and (min-width: 1200px) {
    #app {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr;
      grid-template-rows: auto;
      grid-template-areas:
        "header header header"
        "space-left main space-right"
        "footer footer footer";
    }
  }
}

</style>
