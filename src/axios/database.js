import axios from 'axios'

export default axios.create({
  baseURL: 'https://ml-stock-trader.firebaseio.com/'
})