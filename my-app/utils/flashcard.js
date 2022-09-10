import { GOOGLE_CLOUD_VISION_API_KEY } from '@env';


const sendImageToCloudVisionApi = async (image) => {
    try {
        console.log(GOOGLE_CLOUD_VISION_API_KEY);
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
                GOOGLE_CLOUD_VISION_API_KEY,
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

        // console.log(responseJson);

        if (responseJson) {
            if (responseJson.responses[0].textAnnotations[0].description) {
                // setResponseText(responseJson.responses[0].textAnnotations[0].description);
                return responseJson.responses[0].textAnnotations[0].description;
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