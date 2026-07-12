import api from './api'

export const generateStartup = async (idea) => {
    const response = await api.post('/generate/', { idea })
    return response.data
}
