import { LOCAL_STORAGE_KEY } from '../../../scripts/config/LocalStorageKeys';
import { randomGenerator } from '../../../scripts/helpers/helper';
import { getDataFromLocalStorage, setDataToLocalStorage } from '../../../scripts/LocalStorage';
import type { BaseCommentType, ReplyCommentType } from './data-store_types';

/**
 * Class to generate, update and delete unique id for comments id .
 */
class MessageIdGenerator {
  private readonly minNum = 1;
  private readonly maxNum = 10000;
  private readonly localStorageKey = LOCAL_STORAGE_KEY.postId;
  private readonly messageIdSet = new Set([9625, 9589, 4091, 5068, 7718]);

  /**
   * constructor function to initialize the IdGenerator
   */
  constructor() {
    this.messageIdSet = this.getIdPoolFromLocalStorage() || this.messageIdSet;
  }

  /**
   *
   * @returns - The set of message ids
   */
  getIdPoolFromLocalStorage(): Set<number> | undefined {
    try {
      if (!localStorage) return;
      const localData = getDataFromLocalStorage(this.localStorageKey);
      if (localData) {
        return new Set<number>(JSON.parse(localData));
      } else {
        return this.messageIdSet;
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * Function to set the set of message ids to local storage
   */
  setIdPoolToLocalStorage() {
    try {
      if (localStorage) {
        setDataToLocalStorage(this.localStorageKey, JSON.stringify([...this.messageIdSet]));
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function to generate a new unique id replacing the ond one for comment
   * @param commentObj
   */
  updateId(commentObj: BaseCommentType | ReplyCommentType) {
    // Store the current id as oldId
    const oldId = commentObj.id;
    // Generate a new id and replace the existing id
    commentObj.id = this.generateId();

    // Add the new id to the set
    this.messageIdSet.add(commentObj.id);
    // Remove the old id from the set as well as localstorage if available
    this.deleteId(oldId);
    // Set the new id to localstorage if available
    if (localStorage) this.setIdPoolToLocalStorage();
  }

  /**
   * Function to remove the given id from the set
   * @param commentsId - The comments id to be removed from the set
   */
  deleteId(commentsId: number) {
    try {
      this.messageIdSet.delete(commentsId);
      if (localStorage) this.setIdPoolToLocalStorage();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function to generate a unique id for comments position
   */
  generateId(): number {
    try {
      let randomNum = randomGenerator(this.minNum, this.maxNum);

      while (this.messageIdSet.has(randomNum)) {
        randomNum = randomGenerator(this.minNum, this.maxNum);
      }

      this.messageIdSet.add(randomNum);
      if (localStorage) this.setIdPoolToLocalStorage();
      return randomNum;
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Class to generate, update and delete unique id for comments position.
 */
class PositionGenerator {
  private readonly minNum = 11000;
  private readonly maxNum = 21000;
  private readonly localStorageKey = LOCAL_STORAGE_KEY.positionId;
  positionMap = new Map<number, string>();

  /**
   * constructor function to initialize the IdGenerator
   */
  constructor() {
    this.positionMap.set(19625, '1');
    this.positionMap.set(19589, '2');
    this.positionMap.set(14091, '2.1');
    this.positionMap.set(15068, '2.2');
    this.positionMap.set(17718, '2.3');
    this.positionMap = this.getIdPoolFromLocalStorage() || this.positionMap;
  }

  /**
   *
   * @returns - The set of message ids
   */
  getIdPoolFromLocalStorage(): Map<number, string> | undefined {
    try {
      if (!localStorage) return;
      const localData = getDataFromLocalStorage(this.localStorageKey);

      if (localData) return new Map<number, string>(JSON.parse(localData));

      return this.positionMap;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Function to set the set of message ids to local storage
   */
  setIdPoolToLocalStorage() {
    try {
      if (localStorage) {
        setDataToLocalStorage(this.localStorageKey, JSON.stringify([...this.positionMap]));
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function to get the position of a message given a position id
   * @param commentObj
   */
  getPosition(commentObj: BaseCommentType | ReplyCommentType | number) {
    if (typeof commentObj === 'number') {
      const position = this.positionMap.get(commentObj);
      if (!position) throw new Error("Can't find the position of the reply comment");
      return position;
    }

    const replyPositionId = commentObj.position;
    const replyPosition = this.positionMap.get(replyPositionId);
    if (!replyPosition) throw new Error("Can't find the position of the reply comment");

    return replyPosition;
  }

  /**
   * Function to generate a unique position id for comments
   */
  generateId(): number {
    try {
      let randomNum = randomGenerator(this.minNum, this.maxNum);

      while (this.positionMap.has(randomNum)) {
        randomNum = randomGenerator(this.minNum, this.maxNum);
      }

      // this.positionMap.set(randomNum, position);
      if (localStorage) this.setIdPoolToLocalStorage();
      return randomNum;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function to generate the actual position of a comment
   * @param parentPosition - The parent position of the reply comment
   * @param existingComments - The existing comments in the level
   */
  generateCommentPosition(parentPosition: string, existingComments: number) {
    const commentParentPositionArr = parentPosition.split('.');
    if (commentParentPositionArr.length < 1) throw new Error('Invalid parent position');
    // Position is 1 based
    const noOfReplies = existingComments;
    const commentPosition = commentParentPositionArr.concat(noOfReplies.toString()).join('.');

    if (localStorage) this.setIdPoolToLocalStorage();
    return commentPosition;
  }

  /**
   * Function to generate a new position id as well as actual position for the new comment
   * @param parentPosition - The position of the parent comment, '' if it is a top level comment
   * @param existingComments - The number of existing comments on that level
   * @param isBaseComment - Whether the comment is a base comment or a reply comment
   */
  generateIdAndPosition(parentPosition: string, existingComments: number, isBaseComment: boolean) {
    try {
      const positionKey = this.generateId();
      if (isBaseComment) {
        this.positionMap.set(positionKey, existingComments.toString());
      } else {
        this.positionMap.set(
          positionKey,
          this.generateCommentPosition(parentPosition, existingComments),
        );
      }

      if (localStorage) this.setIdPoolToLocalStorage();
      return positionKey;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function to update the position of a message with the new position
   * @param commentObj
   * @param newPosition
   */
  updatePosition(commentObj: BaseCommentType | ReplyCommentType, newPosition: string) {
    const replyPositionId = commentObj.position;
    if (!this.positionMap.has(replyPositionId)) {
      throw new Error(`Can't find the existing comment with position id ${replyPositionId}`);
    }

    this.positionMap.set(replyPositionId, newPosition);
    if (localStorage) this.setIdPoolToLocalStorage();
  }

  /**
   * Function to remove the given id from the set
   * @param commentsId - The comments id to be removed from the set
   */
  deletePosition(commentsId: number) {
    try {
      this.positionMap.delete(commentsId);
      if (localStorage) this.setIdPoolToLocalStorage();
    } catch (error) {
      throw error;
    }
  }
}

export const messageIdGenerator = new MessageIdGenerator();

export const positionIdGenerator = new PositionGenerator();
