const { supermemo } = require('supermemo'); // consider typescript later
const dayjs = require('dayjs');

let item: SuperMemoItem = {
    interval: 0,
    repetition: 0,
    efactor: 2.5,
  };
  console.log(item);
  
  // each one of this function call is equivalent to a flashcard revision session
  // the grade ranges from 0 to 5, 5 being the best
  item = supermemo(item, 3); // item, grade
  console.log(item);
  
  item = supermemo(item, 3); // 3 - 5 . 1st interval= 1day, 2nd=6day, 3rd -> 
  console.log(item);

  item = supermemo(item, 2); 
  console.log(item);

  // 4: OK, 1: AGAIN

  // interface Flashcard extends SuperMemoItem {
  //   front: string;
  //   back: string;
  //   dueDate: string;
  // }

  // type SuperMemoGrade = 0 | 1 | 2 | 3 | 4 | 5;

  // function practice(flashcard: Flashcard, grade: SuperMemoGrade): Flashcard {
  //   const { interval, repetition, efactor } = supermemo(flashcard, grade); // call the review session & gets the new properties
  //   const dueDate = dayjs(Date.now()).add(interval, 'day').toISOString();
   
  //   return { ...flashcard, interval, repetition, efactor, dueDate };
  // }

  // let flashcard: Flashcard = {
  //   front: "食べる",
  //   back: "eat",
  //   interval: 0,
  //   repetition: 0,
  //   efactor: 2.5,
  //   dueDate: dayjs(Date.now()).toISOString(),
  // };
  // console.log(flashcard);

  // flashcard = practice(flashcard, 5); // review the same flashcard again. Give it a score of 5
  // console.log(flashcard);

  // flashcard = practice(flashcard, 3); // review the same flashcard again. Give it a score of 3
  // console.log(flashcard);

  // flashcard = practice(flashcard, 5); // review the same flashcard again. Give it a score of 5
  // console.log(flashcard);

  // flashcard = practice(flashcard, 3); // review the same flashcard again. Give it a score of 3
  // console.log(flashcard);


  // flashcard = practice(flashcard, 2); // review the same flashcard again. Give it a score of 2
  // // since score < 3, this resets the card interval to 1, repetition to 0
  // console.log(flashcard);

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  export interface TangoFlashcard { // before initialization
    targetWord: string,
    context: string,
    reading: string,
    englishDefinition: [],
    image: string,
    partsOfSpeech: string,
  }

  interface SuperMemoItem {
    interval: number;
    repetition: number;
    efactor: number;
  };
  
  type SuperMemoGrade = 0 | 1 | 2 | 3 | 4 | 5;

  interface SRSTangoFlashcard extends TangoFlashcard, SuperMemoItem {
    dueDate: string;
  }

  export const initializeSRSFlashcard = (flashcard: TangoFlashcard): SRSTangoFlashcard => {
    const interval = 0;
    const repetition = 0;
    const efactor = 2.5;
    const dueDate = dayjs(Date.now()).toISOString();
    return { ...flashcard, interval, repetition, efactor, dueDate };
  };

  const initializeSRSFlashcards = (flashcards: TangoFlashcard[]): SRSTangoFlashcard[] => {
    const result = [];
    for (let flashcard of flashcards) {
      result.push(initializeSRSFlashcard(flashcard));
    }
    return result;
  };

  const validateSRSFlashcards = (flashcards: SRSTangoFlashcard[]): SRSTangoFlashcard[] => {
    // variable for comparing which card is valid for the review deck for today.
    const currentDate = dayjs(Date.now());
    
    // if the current date is larger than the due date of a card, push that card into the review deck
    const reviewDeck = []; // this will be the starting state for the Review Page

    return flashcards;
  }

  const practiseFlashcard = (flashcard: SRSTangoFlashcard, grade: SuperMemoGrade): SRSTangoFlashcard => {
    const { interval, repetition, efactor } = supermemo(flashcard, grade); // call the review session & gets the new properties
    const dueDate = dayjs(Date.now()).add(interval, 'day').toISOString(); 
    return { ...flashcard, interval, repetition, efactor, dueDate };
  };

  const tangoFlashcardFactory = (targetWord: string, 
      context: string, reading: string, englishDefinition: [], image: string, partsOfSpeech: string
    ) => {
    return {
      targetWord,
      context,
      reading,
      englishDefinition,
      image,
      partsOfSpeech
    };
  };

  // say we have flashcards fetched from the backend API
  const tango1 = tangoFlashcardFactory("test 1", "This is test 1", "", [], "", "");
  const tango2 = tangoFlashcardFactory("test 2", "This is test 2", "", [], "", "");
  const tangos = [tango1, tango2];

  // first, we need to initialize the flashcards so that they are SRS compatible
  const SRSTangos = initializeSRSFlashcards(tangos);
  console.log(SRSTangos);

  // then, we need to determine the flashcards that are valid for review
  const SRSTangosForReview = validateSRSFlashcards(SRSTangos);
  console.log(SRSTangosForReview);

  // const validatedTangos = validateFlashcards(tangos);
  // console.log(validatedTangos);