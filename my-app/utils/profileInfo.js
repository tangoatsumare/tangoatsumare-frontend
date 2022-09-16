import axios from 'axios'; 

const getProfileInfoById = async (uuid) => {
    // const api = `https://tangoatsumare-api.herokuapp.com/api/users/:${uuid}`
    // const response = await axios.get(api);
    // console.log("response: ", response);
    // return response ? response : "user not found";
    try {
        const api = `https://tangoatsumare-api.herokuapp.com/api/users`
        const response = await axios.get(api);
        console.log("resposne in profileinfo utils: ", response.data[0]);
        
        return response;
    } catch(err) {
        console.error(err);
    }
}

export { getProfileInfoById };