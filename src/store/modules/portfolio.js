import databaseAxios from "../../axios/database"

// firebase database API
const authDB = '?auth='

export default {
  namespaced: true,

  state: {
    balance: 10000,
    stocks: []
  },
  getters: {
    getBalance (state) {
      return state.balance
    },
    // this solution does not scale well
    stockPortfolio (state, getters, rootState, rootGetters) {
      return state.stocks.map(stock => {
        const record = rootGetters['stocks/getStocks'].find(element => element.id === stock.id)
        return {
          id: stock.id,
          quantity: stock.quantity,
          name: record.name,
          price: record.price
        }
      })
    },
    stockPortfolioById (state) {
      return id => {
        const stock = state.stocks.find(stock => stock.id === id)
        return stock ? stock : { id: null, quantity: 0 }
      }
    },
    totalValue (state, getters) {
      const port = getters.stockPortfolio
      var total = 0
      for (let i = 0; i < port.length; i++) {
        total += port[i].price * port[i].quantity
      }
      return total
    }
  },
  mutations: {
    'BUY_STOCK' (state, { stockId, quantity, stockPrice }) {
      const record = state.stocks.find(element => element.id === stockId)
      var total = stockPrice * quantity
      var buyQuantity = quantity
      if (total > state.balance) {
        buyQuantity = Math.floor(state.balance/stockPrice)
        total = buyQuantity * stockPrice
      }
      if (record) {
        record.quantity += buyQuantity
      } else {
        state.stocks.push({
          id: stockId,
          quantity: buyQuantity
        })
      }
      state.balance -= total
    },
    'SELL_STOCK' (state, { stockId, quantity, stockPrice }) {
      const record = state.stocks.find(element => element.id === stockId)
      let change = 0
      if (record.quantity > quantity) {
        change = stockPrice * quantity
        record.quantity -= quantity
      } else {
        change = stockPrice * record.quantity
        state.stocks.splice(state.stocks.indexOf(record), 1)
      }
      state.balance += change
    },
    'SET_PORTFOLIO' (state, portfolio) {
      state.balance = portfolio.balance
      state.stocks = (portfolio.stocks ? portfolio.stocks : [])
    }
  },
  actions: {
    buyStock ({ commit, dispatch }, order) {
      // changes vuex state
      commit('BUY_STOCK', order)

      // push changes to DB
      dispatch('updateDB', order)
    },
    sellStock ({ commit, dispatch }, order) {
      commit('SELL_STOCK', order)

      // push changes to DB
      dispatch('updateDB', order)
    },
    // update db on buy or sell order
    updateDB ({ state, rootState, getters, dispatch }, order) {
      if (rootState.users.demo) return
      const quantity = getters.stockPortfolioById(order.stockId).quantity
      const stockLocation = 'portfolios/' + rootState.users.userId + '/' + order.stockId + '.json' + authDB + rootState.users.token

      databaseAxios.put(stockLocation, {
        quantity
      })
        .then()
        .catch(err => dispatch('handleError', err.response, {root: true}))

      const balance = state.balance
      const balanceLocation = 'portfolios/' + rootState.users.userId + '/balance' + '.json' + authDB + rootState.users.token
      
      databaseAxios.put(balanceLocation, balance)
        .then()
        .catch(err => dispatch('handleError', err.response, {root: true}))
    },
    // pull portfolio stock info and balance from db to vuex store
    pullPortfolio ({ commit, rootState }) {
      if (rootState.users.demo) return
      const portfolioLocation = 'portfolios/' + rootState.users.userId + '.json'
      // pull portfolio
      databaseAxios.get(portfolioLocation +  authDB + rootState.users.token)
        .then(res => {
          // console.log(res)
          const stocks = getStockArray(res.data)
          const portfolio = {
            balance: res.data.balance,
            stocks
          }
          commit('SET_PORTFOLIO', portfolio)
        })
        .catch(err => dispatch('handleError', err.response, {root: true}))
    }
  }
}

function getStockArray(data) {
  return Object.keys(data)
    .map(key => {
    if (key !== 'balance' && data[key].quantity > 0) {
      return {
        id: Number(key),
        quantity: data[key].quantity
      }
    }
  }).filter(key => key)
}
