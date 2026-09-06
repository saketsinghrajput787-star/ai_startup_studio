import axios from 'axios'

/**
 * Dynamically resolves the API base URL depending on the current environment:
 * 1. VITE_API_URL environment variable (if explicitly configured)
 * 2. In browser on AWS EC2 or production domain (port 80/443 or behind Nginx): relative '/api'
 * 3. In browser directly on dev/preview port: relative '/api' with Vite proxy
 * 4. Local development fallback: 'http://localhost:8000'
 */
const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/+$/, '')
    }

    if (typeof window !== 'undefined') {
        const { hostname, protocol, port } = window.location

        // In production on EC2 (e.g. 16.112.146.157) or standard HTTP/HTTPS ports,
        // Nginx or ALB handles reverse-proxying /api to backend:8000
        if (!port || port === '80' || port === '443') {
            return '/api'
        }

        // When running on dev or preview server (e.g. port 5173, 4173),
        // Vite server/preview proxy routes /api requests to localhost:8000
        if (port === '5173' || port === '4173' || port === '3000') {
            return '/api'
        }

        // If accessed directly on non-standard port without reverse proxy:
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return `${protocol}//${hostname}:8000`
        }
    }

    return import.meta.env.DEV ? 'http://localhost:8000' : '/api'
}

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 60000 // 60s timeout for LLM generation & RAG retrieval
})

// Optional fallback interceptor: if a request to relative /api fails with Network Error or 502/404 on a remote host,
// retry once directly against port 8000
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config
        if (
            !config ||
            config.__isRetry ||
            typeof window === 'undefined'
        ) {
            return Promise.reject(error)
        }

        const { hostname, protocol, port } = window.location
        // If relative /api failed on remote IP/domain (like 16.112.146.157), attempt direct backend on :8000
        if (
            (error.code === 'ERR_NETWORK' || error.response?.status === 502 || error.response?.status === 404) &&
            hostname !== 'localhost' &&
            hostname !== '127.0.0.1' &&
            !config.baseURL.includes(':8000')
        ) {
            config.__isRetry = true
            config.baseURL = `${protocol}//${hostname}:8000`
            return axios(config)
        }

        return Promise.reject(error)
    }
)

export default api
