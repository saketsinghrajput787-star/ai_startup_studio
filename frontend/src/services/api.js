import axios from 'axios'

const api = axios.create({
    baseURL: 'http://98.130.119.180:8000',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api
