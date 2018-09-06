import rawStocks from '../../data/stocks'

import databaseAxios from '../../axios/database'

// firebase database API
const authDB = '?auth='

export default {
  namespaced: true,

  state: {
    // each stock has: { id, name, price }
    stocks: [],
    buyStatus: null
  },
  getters: {
    getStocks (state) {
      return state.stocks
    }
  },
  mutations: {
    'SET_STOCKS' (state, stocks) {
      state.stocks = stocks
    },
    'RND_STOCKS' (state) {
      state.stocks.forEach(stock => {
        const max = (stock.price > 0 ? stock.price * 0.25 : 5)
        const changeAmount = Math.round(Math.random() * Math.round(max) - max/2)
        stock.price += changeAmount
      })
    }
  },
  actions: {
    initStocks ({ commit }) {
      commit('SET_STOCKS', rawStocks)
    },
    randomizeStocks ({ commit, dispatch }) {
      commit('RND_STOCKS')

      dispatch('storeStocks')
    },
    storeStocks ({ state, rootState, dispatch }) {
      databaseAxios.put('stocks/' + rootState.users.userId + '.json' + authDB + rootState.users.token, state.stocks)
        .then()
        .catch(err => dispatch('handleError', err.response, {root: true}))
    },
    pullStocks ({ rootState, commit, dispatch }) {
      return new Promise((resolve, reject) => {
        const stocksLocation = 'stocks/' + rootState.users.userId + '.json'
        databaseAxios.get(stocksLocation + authDB + rootState.users.token)
          .then(res => {
            commit('SET_STOCKS', res.data)
            resolve()
          })
          .catch(err => {
            dispatch('handleError', err.response, {root: true})
          })
      })
    }
  }
}