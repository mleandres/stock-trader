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
    this.$store.commit('RESET_DEMO')
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
    background-color: #FFF
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

.button-large {
  text-align: center;
  text-decoration: none;
  padding: 1em 1em;
  border-radius: 0.3em;
  font-size: 110%;
  margin: 0.2em;
  letter-spacing: 0.3px;
}

.button-small {
  text-align: center;
  text-decoration: none;
  padding: 0.5em 0.7em;
  border-radius: 0.3em;
  font-size: 100%;
  margin: 0.2em;
  letter-spacing: 0.5px;
}

.main-button {
  background-color: #3A606E;
  border: solid 1px #2B4651;
  color: #FFF;
  font-weight: 300;
}

.main-button:hover {
  text-decoration: none;
  background-color: #2B4651;
}

.main-button:focus {
  text-decoration: none;
  color: #FFF;
}

.secondary-button {
  background-color: #E0E0E0;
  border: solid 1px #a3a3a3;
  color: #000;
  font-weight: normal;
}

.secondary-button:hover {
  text-decoration: none;
  background-color: #a3a3a3;
  color: #000;
}

.secondary-button:focus {
  text-decoration: none;
  color: #000;
}

</style>
