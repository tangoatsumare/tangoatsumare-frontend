import axios from "axios";
import { SRSTangoFlashcard } from "./supermemo";

const USERS_URL = `https://tangoatsumare-api.herokuapp.com/api/users/`;
const USER_BY_UID_URL = `https://tangoatsumare-api.herokuapp.com/api/usersuid/`;
const FLASHCARDS_URL = `https://tangoatsumare-api.herokuapp.com/api/flashcards/`;
const FLASHCARDS_BY_USER_URL = `https://tangoatsumare-api.herokuapp.com/api/flashcardsby/`;
const SRS_FLASHCARDS_BY_USER_URL = `https://tangoatsumare-api.herokuapp.com/api/cardflashjoinuid/`;
const USERSTOCARDS_URL = `https://tangoatsumare-api.herokuapp.com/api/userstocards/`;
const TAGS_URL = `https://tangoatsumare-api.herokuapp.com/api/tags`;

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
    const getUsers = () => {
        return axios
            .get(USERS_URL)
            .then((response: any) => response.data)
            .catch(err => err);
    };

    const getUserByUserId = (userId: UserId) => {
        return axios
            .get(USER_BY_UID_URL + userId)
            .then((response: any) => response.data[0])
            .catch(err => err);
    };

    const getFlashcards = () => {
        return axios
            .get(FLASHCARDS_URL)
            .then((response: any) => response.data)
            .catch(err => err);
    };

    const getFlashcardsByUser = (userId: UserId) => {
        return axios
            .get(FLASHCARDS_BY_USER_URL + userId)
            .then((response: any) => response.data)
            .catch(err => err);
    };

    const getSRSFlashcardsByUser = (userId: UserId): Promise<SRSTangoFlashcard[]> => {
        return axios
        .get(SRS_FLASHCARDS_BY_USER_URL + userId)
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
    const addSRSCard = async (body: any) => {
        await axios.post(USERSTOCARDS_URL, body)
        .then(res => console.log("success"))
        .catch(err => console.log(err));
    };

    const getTags = () => {
        return axios
            .get(TAGS_URL)
            .then((response: any) => response.data)
            .catch(err => err);
    };

    return {
        getUsers,
        getUserByUserId,
        getFlashcards,
        getFlashcardsByUser,
        getSRSFlashcardsByUser,
        updateFlashcardsSRSProperties,
        addSRSCard,
        getTags
    }
})();

export {
    HTTPRequest
};