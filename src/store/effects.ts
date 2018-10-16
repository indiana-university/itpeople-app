import { NotAuthorizedError } from "../components/errors";

const clearAuthToken = () =>
    localStorage.removeItem('authToken')

const getAuthToken = () => 
    localStorage.getItem("authToken")

const setAuthToken = (token: string) => 
    localStorage.setItem('authToken', token)

const redirectToLogin = () =>
    window.location.assign(`${process.env.REACT_APP_OAUTH2_AUTH_URL}?response_type=code&client_id=${process.env.REACT_APP_OAUTH2_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_WEB_URL}/signin`)

const callApi = (method: string, url: string, path: string, data?: any, headers?: any) => {
    const combinedHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
    }
    return fetch(url + '/api' + path, {
        body: JSON.stringify(data),
        headers: combinedHeaders,
        method,
    })
        .then(res => {
            if (!res.ok){
                throw res.status === 401 
                    ? new NotAuthorizedError("user not authorized")
                    : new Error(`Unable to complete request. The server returned ${res.statusText} (${res.status})`)
            }
            
            return res.json()})

}

const callApiWithAuth = (method: string, url: string, path: string, data?: any) => {
    const authToken = getAuthToken()
    const authHeader = authToken ? { Authorization: `Bearer ${authToken}` } : {}
    return callApi(method, url, path, data, authHeader)
}
    
export { 
    callApi,
    callApiWithAuth,
    clearAuthToken,
    getAuthToken,
    setAuthToken ,
    redirectToLogin
}
