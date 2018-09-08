<template>
  <div>
    <div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">
          {{ stock.name }}
          <small>(Quantity: {{ stock.quantity }}, Price: {{ stock.price | currency }})</small>
        </h3>
      </div>
      <div class="panel-body">
        <div class="pull-left">
          <input class="form-control"
                 type="number"
                 v-model="quantity"
                 placeholder="Quantity"
                 :class="{ insufficient: noStock }"
                 >
        </div>
        <div class="pull-right">
          <button class="btn btn-warning"
                  @click="sellStock"
                  :disabled="disableSell">{{ sellText }}: {{ quantity * stock.price | currency}}</button>
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
    sellStock () {
      const order = {
        stockId: this.stock.id,
        quantity: +this.quantity,
        stockPrice: this.stock.price
      }
      this.$store.dispatch('portfolio/sellStock', order)
      this.quantity = null
    }
  },
  computed: {
    disableSell () {
      return (this.noStock || +this.quantity <= 0 || !Number.isSafeInteger(+this.quantity))
    },
    noStock () {
      return this.quantity > this.stock.quantity
    },
    sellText () {
      return (this.noStock ? 'Not Enough Stock' : 'Sell')
    }
  }
}
</script>

<style scoped>
.insufficient {
  border: red 1px solid;
}
</style>
