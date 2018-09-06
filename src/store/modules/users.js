import authAxios from '../../axios/auth'
import databaseAxios from '../../axios/database'
//import refreshAxios from '../../axios/refresh'

import router from '../../routes'

// firebase authentication API
const newUser = 'signupNewUser?key='
const verifyUser = 'verifyPassword?key='
const apiKey = 'AIzaSyDcbJq3Hoq0EP0R4rs1t-lnw_vQizi3ELc'

// firebase database API
const DBSuffix = '.json'
const authDB = '?auth='

export default {
  state: {
    token: null,
    userId: null,
    refreshToken: null,
    username: null
  },
  getters: {
    token (state) {
      return state.token
    }
  },
  mutations: {
    // save user authentication information to vuex state
    //  -> for user signup and login
    authUser (state, userData) {
      state.token = userData.token
      state.userId = userData.userId
      state.refreshToken = userData.refreshToken
    },
    // clear user authentication in vuex state
    //  -> for logout
    clearAuthData (state) {
      state.token = null
      state.userId = null
      state.user = null
    },
    setUsername (state, username) {
      state.username = username
      // console.log(state.username)
    }
  },
  actions: {
    // initiates signup procedure
    // -> creates new authentication account
    // -> saves new user auth info locally (and so logs new user in)
    // -> stores new user info in firebase DB
    signup ({ commit, dispatch, getters }, userData) {
      authAxios.post(newUser + apiKey, {
        email: userData.email,
        password: userData.password,
        returnSecureToken: true
      })
        .then(res => {
          // console.log(res)
          const data = res.data
          commit('authUser', {
            token: data.idToken,
            userId: data.localId,
            refreshToken: data.refreshToken
          })
          storeSession(res.data)
          dispatch('setLogoutTimer', res.data.expiresIn)

          dispatch('storeUserInfo', {
            email: userData.email,
            name: userData.name
          })
          commit('setUsername', userData.name)

          dispatch('storeUserStocks', {
            stocks: getters['stocks/getStocks']
          })
          dispatch('storeUserPortfolio', {
            balance: 10000,
            stockPortfolio: []
          })

          dispatch('stocks/storeStocks')

          router.replace('/portfolio')
        })
        .catch(err => {
          const status = err.response.status
          if (status >= 500) {
            alert("There was a problem contacting the server. Please try again later")
          } else if (status === 400) {
            alert("That email is invalid or already in use")
          } else {
            alert("An unexpected error occured. Error code: ", status)
          }
        })
    },

    // stores one user's basic info in DB
    //  -> root/users/$userId
    storeUserInfo ({ state }, userData) {
      if (!state.token) return
      
      databaseAxios.put('users/' + state.userId + DBSuffix + authDB + state.token, userData)
        .then()
        .catch(err => dispatch('handleError', err.response))
    },

    // stores one user's stock price data in DB
    //  -> root/stocks/$userId
    // NOTE: this only makes sense when mocking stock prices for each user
    storeUserStocks ({ state }, userStocks) {
      if (!state.token) return
      
      databaseAxios.put('stocks/' + state.userId + DBSuffix + authDB + state.token, userStocks)
        .then()
        .catch(err => dispatch('handleError', err.response))
    },

    // stores one user's stockportfolio data in DB
    //  -> root/portfolios/$userId
    storeUserPortfolio ({ state }, userPortfolio) {
      if (!state.token) return
      
      databaseAxios.put('portfolios/' + state.userId + DBSuffix + authDB + state.token, userPortfolio)
        .then()
        .catch(err => dispatch('handleError', err.response))
    },

    // attempts to login an existing user
    //  -> authenticates and gets token
    //  -> load user info
    //  -> load user stocks from db
    //  -> load user portfolio from db
    login ({ commit, dispatch }, { email, password }) {
      authAxios.post(verifyUser + apiKey, {
        email,
        password,
        returnSecureToken: true
      })
        .then(res => {
          const data = res.data

          commit('authUser', {
            token: data.idToken,
            userId: data.localId,
            refreshToken: data.refreshToken
          })
          storeSession(res.data)
          dispatch('setLogoutTimer', res.data.expiresIn)

          // pull username
          dispatch('pullUsername')

          // pull user portfolio
          dispatch('portfolio/pullPortfolio')

          // pull user stocks
          dispatch('stocks/pullStocks')
            .then(response => router.replace('/'))
        })
        .catch(err => {
          if (err.response) {
            const status = err.response.status
            if (status >= 500) {
              alert("There was a problem contacting the server. Please try again later")
            } else if (status === 400) {
              alert("Your username/password is invalid")
            } else {
              alert("An unexpected error occured. Error code: ", status)
            }
          }
        })
    },
    resumeSession ({ commit, dispatch }) {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const expirationDate = localStorage.getItem('expirationDate')
      const expiresIn = localStorage.getItem('expiresIn')
      const refreshToken = localStorage.getItem('refreshToken')
      const username = localStorage.getItem('username')
      const now = new Date()

      if (!token) {
        return
      }
      if (now >= expirationDate) {
        dispatch('logout')
        alert('Your session has timed out. Please log in again')
      }
      commit('authUser', {
        token,
        userId,
        refreshToken
      })
      commit('setUsername', username)
      dispatch('portfolio/pullPortfolio', userId)
    },
    logout ({ commit }) {
      commit('clearAuthData')
      clearSession()
      router.replace('/login')
    },
    setLogoutTimer ({ dispatch }, expirationTime) {
      setTimeout(() => {
        dispatch('logout')
        alert('Your session has timed out. Please log in again')
      }, expirationTime * 1000)
    },
    pullUsername ({ commit, state }) {
      const usernameLocation = 'users/' + state.userId + '.json'
      databaseAxios.get(usernameLocation + authDB + state.token)
        .then(res => {
          // console.log(res)
          localStorage.setItem('username', res.data.name)
          commit('setUsername', res.data.name)
        })
        .catch(err => dispatch('handleError', err.response))
    }
    /*
    setRefreshTimer ({ state, dispatch }, expirationTime) {
      setTimeout(() => {
        console.log(state.refreshToken)
        dispatch('refreshToken', state.refreshToken)
      }, Math.floor(expirationTime*(0.9)))
    },

    refreshToken ({ dispatch }, refreshToken) {
      refreshAxios.post('token?key=' + apiKey, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
      .then(res => {
        dispatch('authAndSetRefresh', res.data)
      })
      .catch(err => console.log('oops',err))
    },

    authAndSetRefresh({ commit, dispatch }, data) {
      commit('authUser', {
        token: data.idToken,
        userId: data.localId,
        refreshToken: data.refreshToken
      })
      storeSession(data)
      dispatch('setRefreshTimer', data.expiresIn)
    }
    */
  }
}

// helper function to locally store session data
function storeSession (data) {
  const now = new Date()
  const expirationDate = new Date(now.getTime() + data.expiresIn * 1000)
  localStorage.setItem('expirationDate', expirationDate)
  localStorage.setItem('expiresIn', data.expiresIn * 1000)
  localStorage.setItem('token', data.idToken)
  localStorage.setItem('userId', data.localId)
  localStorage.setItem('refreshToken', data.refreshToken)
}

// helper function to clear local session data
function clearSession () {
  localStorage.removeItem('expirationDate')
  localStorage.removeItem('expiresIn')
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('username')
}
