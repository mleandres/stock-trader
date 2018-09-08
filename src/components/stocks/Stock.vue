<template>
  <div>
    <div class="panel panel-success">
      <div class="panel-heading">
        <h3 class="panel-title">
          {{ stock.name }}
          <small>(Price: {{ stock.price | currency }})</small>
        </h3>
      </div>
      <div class="panel-body">
        <div class="pull-left">
          <input class="form-control"
                 type="number"
                 v-model="quantity"
                 placeholder="Quantity"
                 :class="{ insufficient: insufficientFunds }"
                 >
        </div>
        <div class="pull-right">
          <button class="btn btn-success"
                  @click="buyStock"
                  :disabled="disableBuy"
          >{{ buyText }}: {{ quantity * stock.price | currency}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stock: Object
  },
  data () {
    return {
      quantity: ''
    }
  },
  methods: {
    buyStock () {
      const order = {
        stockId: this.stock.id,
        quantity: +this.quantity,
        stockPrice: this.stock.price
      }
      this.$store.dispatch('portfolio/buyStock', order)
      this.quantity = null
    }
  },
  computed: {
    balance () {
      return this.$store.getters['portfolio/getBalance']
    },
    disableBuy () {
      return (this.insufficientFunds || +this.quantity <= 0 || !Number.isSafeInteger(+this.quantity))
    },
    insufficientFunds () {
      return this.quantity * this.stock.price > this.balance
    },
    buyText () {
      return (this.insufficientFunds ? 'Insufficient Funds' : 'Buy')
    }
  }
}
</script>

<style scoped>
.insufficient {
  border: red 1px solid;
}

.inline {
  display: inline;
}
</style>
