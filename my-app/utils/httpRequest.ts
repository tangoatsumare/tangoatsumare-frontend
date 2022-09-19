import axios from "axios";
import { SRSTangoFlashcard } from "./supermemo";

const FLASHCARDS_BY_USER_URL = `https://tangoatsumare-api.herokuapp.com/api/cardflashjoinuid/`;
const USERSTOCARDS_URL = `https://tangoatsumare-api.herokuapp.com/api/userstocards/`;

export interface UsersToCardsSRSProps {
    _id: string,
    counter: number,
    efactor: number,
    interval: number,
    repetition: number,
    due_date: string
}

export type UserId = string | undefined

const HTTPRequest = (() => {
    const getSRSFlashcardsByUser = (userId: UserId): Promise<SRSTangoFlashcard[]> => {
        return axios
        .get(FLASHCARDS_BY_USER_URL + userId)
        .then((response: any) => {
            return response.data;
        });
    }

    // PATCH request to update the user_to_flashcard scheduling table
    const updateFlashcardsSRSProperties = async (body: UsersToCardsSRSProps[]) => {
        await axios.patch(USERSTOCARDS_URL, body)
        .then(res => console.log("success"))
        .catch(err => console.log(err));
    };

    return {
        getSRSFlashcardsByUser,
        updateFlashcardsSRSProperties,
    }
})();

export {
    HTTPRequest
};