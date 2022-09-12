// import { GOOGLE_CLOUD_VISION_API_KEY } from '@env';
import axios from 'axios';

const sendImageToCloudVisionApi = async (image) => {
    try {
        let body = JSON.stringify({
            requests: [
                {
                    features: [
                        { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1}
                    ],
                    image: {
                        // source: {
                        //     imageUri: image
                        // }
                        content: image
                    }
                }
            ]
        });

        const response = await fetch(
            'https://vision.googleapis.com/v1/images:annotate?key=' +
                process.env.GOOGLE_CLOUD_VISION_API_KEY,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: body
            }
        );
        const responseJson = await response.json();

        if (responseJson) {
            if (Object.keys(responseJson.responses[0]).length !== 0) {
                return responseJson.responses[0].textAnnotations[0].description;
            } else {
                return "no word detected"
            }
        }
    } catch (err) {
        console.log(err);
        return `fail.. error as follows:\n${err}`;
    }
}

export {
    sendImageToCloudVisionApi
};