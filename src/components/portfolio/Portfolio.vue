<template>
  <div id="portfolio">
    <div class="stock-list">
      <h2 v-if="emptyPortfolio">Your portfolio is empty!</h2>
      <h2 v-else>Total Portfolio Value: {{ totalValue | currency }}</h2>
      <app-stock
                v-for="stock in stocks" 
                :key="stock.id"
                :stock="stock"
                >
      </app-stock>
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
    },
    totalValue () {
      return this.$store.getters['portfolio/totalValue']
    }
  },
  mounted () {
    document.title = this.$store.getters.name + "'s Portfolio"
  }
}
</script> 

<style scoped>

</style>
