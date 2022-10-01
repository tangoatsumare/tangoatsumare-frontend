//remove flagged cards
const filterOutInappropriateFlashcards = (cards: any[]): any[] => {
    return cards.filter((card: any) => (!card.flagged_inappropriate));
}

// cards with delete keyword in its created_by field are cards that deleted by their owners
const filterOutDeletedFlashcardsFromFlashcards = (cards: any[]): any[] => {
    return cards.filter((card: any) => !card.created_by.includes("delete"));
}

const formatFlashcardRelatedUserDetails = (cards: any[], users: any[]): any[] => {
    const formattedCards = [...cards];
    for (const card of cards) {
      const result = users.find((user: any) => user.uuid === card.created_by);
      if (result) {
          card.created_by_username = result.user_name; // replace uid with username
          card.avatar_url = result.avatar_url; // add field
      }
      // card.created_timestamp = dayjs(card.created_timestamp)
        // .fromNow(); 
      // https://day.js.org/docs/en/plugin/relative-time
    }
    return formattedCards;
};

const preprocessFlashcards = (cards: any[], users: any[]): any[] => {
    cards = filterOutInappropriateFlashcards(cards);
    cards = filterOutDeletedFlashcardsFromFlashcards(cards);
    cards = formatFlashcardRelatedUserDetails(cards, users);
    return cards;
}


export interface Tag {
    _id: string,
    tag: string,
    flashcards: string[]
  }

// reshape the object so it is easier to work with
const getTagsToFlashcardsIdObject = (tags: Tag[]): object => {
const tagsToFlashcardsId = {};
for (const tag of tags) {
    // https://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable
    tagsToFlashcardsId[tag.tag] = tag.flashcards;

}
    return tagsToFlashcardsId;
}

export {
    preprocessFlashcards,
    getTagsToFlashcardsIdObject
}