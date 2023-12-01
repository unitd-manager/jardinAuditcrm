import axios from 'axios'

const api = axios.create({
baseURL: 'http://43.228.126.245:4015',

});

export default api