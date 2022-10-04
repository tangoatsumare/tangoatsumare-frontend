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

const getFlashcardsHashTagsKeywordIntersection = (flashcards: object[], selectedTags, tagsToFlashcardsArr, keyword) => {        
    // curate the flashcardsCurated by the search text
    flashcards = flashcards.filter(card => card.target_word.includes(keyword));

    // formatting an array of all selected tags' sub-array
    const filterArr = [];
    for (let i = 0; i < selectedTags.length; i++) {
        filterArr.push(tagsToFlashcardsArr[selectedTags[i]]); 
    }

    // using reduce to get the intersection of multiple arrays
    const flashcardIntersectionArrFromSelectedTags = filterArr.length !== 0 ?
        filterArr.reduce((prev, curr) => {
            return curr.filter(value => prev.includes(value));
        })
    : filterArr; // if filterArr is empty, that means no intersection. So simply assign filterArr here

    // grab all ids from the function incoming parameter
    const flashcardIdsFromUI: string[] = [];
    for (const item of flashcards) {
        flashcardIdsFromUI.push(item._id);
    }

    // grab the intersected match between the flashcardIds and the flashcardIntersectionArrFromSelectedTags
    const matchingFlashcardIds = flashcardIntersectionArrFromSelectedTags.filter(item => {
        return flashcardIdsFromUI.includes(item);
    });
    // console.log("the intersected cards:", matchingFlashcardIds);

    // set flashcardsCurated with the search text and/or the search hashtags
    // if no selectedTags, return the flashcards that are filtered by the text
    // else, return the result with both text and hashtag(s) filtering

    return selectedTags.length > 0 ? flashcards.filter(item => matchingFlashcardIds.includes(item._id)): flashcards;
};

export {
    preprocessFlashcards,
    getTagsToFlashcardsIdObject,
    getFlashcardsHashTagsKeywordIntersection
}