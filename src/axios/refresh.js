import axios from 'axios'

export default axios.create({
  baseURL: 'https://securetoken.googleapis.com/v1/'
})