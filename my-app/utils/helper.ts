const filterOutInappropriateFlashcards = (cards: any[]): any[] => {
    return cards.filter((card: any) => (!card.flagged_inappropriate));
}

const filterOutDeletedFlashcardsFromFlashcards = (cards: any[]): any[] => {
    // cards with delete keyword in its created_by field are cards that deleted by their owners
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

export {
    filterOutInappropriateFlashcards,
    filterOutDeletedFlashcardsFromFlashcards,
    formatFlashcardRelatedUserDetails
}