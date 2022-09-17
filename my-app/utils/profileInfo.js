import axios from 'axios'; 

const getProfileInfoById = async (uuid) => {
    // const api = `https://tangoatsumare-api.herokuapp.com/api/users/:${uuid}`
    // const response = await axios.get(api);
    // console.log("response: ", response);
    // return response ? response : "user not found";
    try {
        const api = `https://tangoatsumare-api.herokuapp.com/api/users`
        const response = await axios.get(api);
        // console.log("resposne in profileinfo utils: ", response.data[0]);
        // let userInfo = response.data[0];
        // return userInfo;
        return response.data[0];
    } catch(err) {
        console.error(err);
    }
}

const tempGetProfileInfoByUID = async () => {
    (async() => {
        try {
            const response = await fetch(`https://tangoatsumare-api.herokuapp.com/api/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const resToJson = await response.json();
            // console.log("🤢🤢🤢🤢🤢 resToJson check: ", resToJson);
            return resToJson;
        } catch (err) {
            console.log("🤯🤯🤯 error: ", err);
        }
    })();
}

export { getProfileInfoById, tempGetProfileInfoByUID };