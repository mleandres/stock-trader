import Vue from 'vue'
import Vuex from 'vuex'

import stocks from './modules/stocks'
import portfolio from './modules/portfolio'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    stocks,
    portfolio,
    users
  },
  getters: {
    getCurrentRoute (state) {
      const curr = state.route
      return curr ? curr.name : null
    },
    getLastRoute (state) {
      const from = state.route.from
      return from ? from.name : null
    }
  },
  actions: {
    handleError ({ dispatch }, error) {
      alert('An error occured. Please log in again. Error code: ' + error.status)
      dispatch('logout')
    },
    
    /////////////////////////////////////////
    // can probably delete actions below here
    saveData ({ getters }) {
      const data = {
        balance: getters['portfolio/getBalance'],
        stockPortfolio: getters['portfolio/stockPortfolio'],
        stocks: getters['stocks/getStocks']
      }
      Vue.http.put('data.json', data)
    },
    loadData ({ commit }) {
      Vue.http.get('data.json')
        .then(res => res.json())
        .then(data => {
          if (data) {
            commit('portfolio/SET_BALANCE', data.balance)
            commit('portfolio/SET_STOCK_PORTFOLIO', data.stockPortfolio)
            commit('stocks/SET_STOCKS', data.stocks)
          }
        })
    }
  }

  //actions
})