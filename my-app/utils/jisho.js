// import JishoAPI from "unofficial-jisho-api";
// const JishoAPI = require('unofficial-jisho-api');
// const jisho = new JishoAPI();
import axios from 'axios'; // https://github.com/axios/axios
import {
    COTOHA_ACCESS_TOKEN_PUBLISH_URL,
    COTOHA_API_BASE_URL,
    COTOHA_DEV_CLIENT_ID,
    COTOHA_DEV_SECRET
} from '@env';

const lookupJishoApi = async (word) => {
    const api = `https://jisho.org/api/v1/search/words?keyword=${word}`;
    const response = await axios.get(api);
    const definitions = response.data.data[0].senses[0].english_definitions;
    return definitions;

    // implementation for COTOHA
    // let accessToken;
    // // https://api.ce-cotoha.com/contents/reference/accesstoken.html
    // await axios.post(COTOHA_ACCESS_TOKEN_PUBLISH_URL, {
    //     "grantType": "client_credentials",
    //     "clientId": COTOHA_DEV_CLIENT_ID,
    //     "clientSecret": COTOHA_DEV_SECRET
    // })
    // .then(res => accessToken = res.data["access_token"])
    // .catch(err => console.log(err));
    // console.log(accessToken);
    // console.log(`https://api.ce-cotoha.com/api/dev/nlp/v1/parse`);
    // console.log(`Bearer ${accessToken}`);

    // // test with the "parsing" API
    // // https://api.ce-cotoha.com/contents/reference/apireference.html#parsing
    // return await axios({
    //     method: 'post',
    //     url: `https://api.ce-cotoha.com/api/dev/nlp/v1/parse`,
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${accessToken}`,
    //     },
    //     data: {
    //         'sentence': 
    //         '犬は歩く',
    //         // word,
    //         'type': 'default'
    //     }
    // })
    // .then(res => {
    //     return res.data.result;
    // })
    // .catch(err => console.log(err));
};

export { lookupJishoApi }

/*
unofficial jisho API is not working in this Expo environment..
*/