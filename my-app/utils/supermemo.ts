// const { supermemo } = require('supermemo'); // consider typescript later
const dayjs = require('dayjs');

// Temporarily copy and paste from the supermemo codebase. for testing purposes
function supermemo(
  item: SuperMemoItem,
  grade: SuperMemoGrade
): SuperMemoItem {
  let nextInterval: number;
  let nextRepetition: number;
  let nextEfactor: number;

  if (grade >= 3) {
    if (item.repetition === 0) {
      nextInterval = SRSProperties.getFirstInterval(); // Updated
      nextRepetition = 1;
    } else if (item.repetition === 1) {
      nextInterval = SRSProperties.getSecondInterval(); // Updated
      nextRepetition = 2;
    } else {
      nextInterval = Math.round(item.interval * item.efactor);
      nextRepetition = item.repetition + 1;
    }
  } else {
    nextInterval = SRSProperties.getFirstInterval(); // Updated
    nextRepetition = 0;
  }

  nextEfactor =
    item.efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

  if (nextEfactor < 1.3) nextEfactor = 1.3;

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    efactor: nextEfactor,
  };
}

  export interface TangoFlashcard { // before initialization
    // targetWord: string,
    // context: string,
    // reading: string,
    // englishDefinition: [],
    // image: string,
    // partsOfSpeech: string,
    target_word: string,
    example_sentence: string,
    reading: string,
    card_language: string,
    Eng_meaning: string[],
    created_by: string | undefined,
    created_timestamp: string,
    picture_url: string,
    // parts_of_speech: string,
    flagged_inappropriate: boolean
  }

  export interface SuperMemoItem {
    interval: number;
    repetition: number;
    efactor: number;
  };
  
  export type SuperMemoGrade = 0 | 1 | 2 | 3 | 4 | 5;

  export interface SRSTangoFlashcard extends SuperMemoItem {
    counter: number;
    due_date: string;
    Flashcard: [TangoFlashcard]
  }

  export const initializeSRSFlashcard = (flashcard: TangoFlashcard): SRSTangoFlashcard => {
    const counter = 0;
    const interval = 0;
    const repetition = 0;
    const efactor = 2.5;
    const due_date = dayjs(Date.now()).toISOString();
    return { ...flashcard, counter, interval, repetition, efactor, due_date };
  };

  export const initializeSRSFlashcards = (flashcards: TangoFlashcard[]): SRSTangoFlashcard[] => {
    const result = [];
    for (let flashcard of flashcards) {
      result.push(initializeSRSFlashcard(flashcard));
    }
    return result;
  };

  export const validateFlashcard = (flashcard: SRSTangoFlashcard): boolean => {
    // variable for comparing which card is valid for the review deck for today.
    
    const now = dayjs(new Date());
    // console.log(now);
    // console.log(now.format("h:mm:ss a"))
    // console.log(now.format("YYYY-MM-DD"));
  
    const currentDate = dayjs(now); // TO CHANGE. timezone. say 4am
    // console.log(currentDate);

    // const currentDate = dayjs('2022-09-14 00:00');
    const { due_date } = flashcard;
    // console.log(dayjs(dueDate).diff(currentDate));
    const diff = dayjs(due_date).diff(currentDate);
    // if dueDate - currentDate is negative
    // that means the card is due and can be reviewed
    return diff < 0 ? true : false;
  };

  export const getReviewableSRSFlashcards = (flashcards: SRSTangoFlashcard[]): SRSTangoFlashcard[] => {
    const reviewDeck = []; // this will be the starting state for the Review Page
    for (const flashcard of flashcards) {
      if (validateFlashcard(flashcard)) {
        reviewDeck.push(flashcard);
      }
    }
    return reviewDeck;
  }

  export const practiseFlashcard = (flashcard: SRSTangoFlashcard, grade: SuperMemoGrade): SRSTangoFlashcard => {
    const { interval, repetition, efactor } = supermemo(flashcard, grade); // call the review session & gets the new properties
    // From the docs:
    // https://day.js.org/docs/en/manipulate/add#docsNav
    // When decimal values are passed for days and weeks, they are rounded to the nearest integer before adding.

    // so, adopt adding by seconds to avoid the unwanted rounding
    const due_date = dayjs(Date.now()).add(interval * 24 * 60 * 60, 'second').toISOString(); 
    return { 
      ...flashcard, 
      counter: flashcard.counter + 1,
      interval, 
      repetition,
      efactor,
      due_date 
    };
  };

  // IIFE Module. properties setting
  export const SRSProperties = (() => {
    let GOOD: SuperMemoGrade = 5;
    let AGAIN: SuperMemoGrade = 1;
    let FIRST_INTERVAL: number = 1;
    let SECOND_INTERVAL: number = 6;

    const getGradeForGood = () => GOOD;
    const getGradeForAgain = () => AGAIN;
    const getFirstInterval = () => FIRST_INTERVAL;
    const getSecondInterval = () => SECOND_INTERVAL;

    const setGradeForGood = (grade: SuperMemoGrade) => {
      GOOD = grade;
    };
    const setGradeForAgain = (grade: SuperMemoGrade) => {
      AGAIN = grade;
    }
    const setFirstIntervalForAgain = () => {
      FIRST_INTERVAL = 0;
    }
    const setFirstInterval = (value: number) => {
      FIRST_INTERVAL = value;
    }
    const setSecondInterval = (value: number) => {
      SECOND_INTERVAL = value;
    }

    return {
      getGradeForGood,
      getGradeForAgain,
      setGradeForGood,
      setGradeForAgain,
      getFirstInterval,
      getSecondInterval,
      setFirstInterval,
      setSecondInterval,
      setFirstIntervalForAgain
    }
  })();

  export const setFlashcardAsGood = (flashcard: SRSTangoFlashcard): SRSTangoFlashcard => {
    const GOOD: SuperMemoGrade = SRSProperties.getGradeForGood();
    return practiseFlashcard(flashcard, GOOD);
  };

  export const setFlashcardAsAgain = (flashcard: SRSTangoFlashcard): SRSTangoFlashcard => {
    
    // TO CHANGE.
    // set the interval to be zero
    // set the duedate to be now
    // set the repetition to be zero
    // increment counter by 1

    let { interval, due_date, repetition, counter } = flashcard;
    interval = 0;
    due_date = dayjs(Date.now());
    repetition = 0;
    counter = counter + 1;
    return { ...flashcard, interval, due_date, repetition, counter };

    // const AGAIN: SuperMemoGrade = SRSProperties.getGradeForAgain();
    // return practiseFlashcard(flashcard, AGAIN);
  };


  // const tangoFlashcardFactory = (targetWord: string, 
  //     context: string, reading: string, englishDefinition: [], image: string, partsOfSpeech: string
  //   ) => {
  //   return {
  //     targetWord,
  //     context,
  //     reading,
  //     englishDefinition,
  //     image,
  //     partsOfSpeech
  //   };
  // };

  // // say we have flashcards fetched from the backend API
  // const tango1 = tangoFlashcardFactory("test 1", "This is test 1", "", [], "", "");
  // const tango2 = tangoFlashcardFactory("test 2", "This is test 2", "", [], "", "");
  // const tangos = [tango1, tango2];

  // // first, we need to initialize the flashcards so that they are SRS compatible
  // const SRSTangos = initializeSRSFlashcards(tangos);
  // // console.log(SRSTangos);

  // // then, we need to determine the flashcards that are valid for review
  // const SRSTangosForReview = getReviewableSRSFlashcards(SRSTangos);
  // console.log(SRSTangosForReview);

  // const validatedTangos = validateFlashcards(tangos);
  // console.log(validatedTangos);

  // const batchReview = () => {
  //   for (let i = 0; i < SRSTangosForReview.length; i++) {
  //     SRSTangosForReview[i] = practiseFlashcard(SRSTangosForReview[i], 4);
  //     // SRSTangosForReview[i] = practiseFlashcard(SRSTangosForReview[i], 1);
  //   }
  // };
  // batchReview();
  // console.log(SRSTangosForReview);

  // const validity = validateFlashcard(SRSTangosForReview[0]);
  // console.log(validity);