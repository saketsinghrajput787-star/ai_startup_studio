import api from './api'

export const uploadDocument = async (file) => {
    const formData = new FormData()

    formData.append('file', file)

    const response = await api.post('/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return response.data
}

export const getKnowledgeDocuments = async () => {
    const response = await api.get('/knowledge/')

    return response.data
}

export const clearKnowledgeBase = async () => {
    const response = await api.delete('/knowledge/')

    return response.data
}
