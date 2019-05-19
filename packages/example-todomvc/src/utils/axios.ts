import Axios from 'axios'

export const axios = Axios.create({
  baseURL: 'http://localhost:3000',
})
