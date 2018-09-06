<template>
  <div id="portfolio">
    <div class="stock-list">
      <h2 v-if="emptyPortfolio">Your portfolio is empty!</h2>
      <transition-group class="slide-left">
        <app-stock v-for="stock in stocks" 
                  :key="stock.id"
                  :stock="stock"
                  >
        </app-stock>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Stock from './Stock.vue'

export default {
  components: {
    appStock: Stock
  },
  computed: {
    stocks () {
      return this.$store.getters['portfolio/stockPortfolio']
    },
    emptyPortfolio () {
      return this.stocks.length === 0
    }
  }
}
</script> 

<style scoped>

</style>
