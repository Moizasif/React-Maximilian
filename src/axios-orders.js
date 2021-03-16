import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://react-burger-e1c1b-default-rtdb.firebaseio.com/'
});

export default instance;