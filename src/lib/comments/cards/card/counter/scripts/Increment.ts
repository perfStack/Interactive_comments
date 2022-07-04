import type { BaseCommentType, ReplyCommentType } from '../../../../../data/data-store_types';
import { positionIdGenerator } from '../../../../../data/RandomGenerator';
import { findParentComment } from '../../../../Scripts/CommentsHelper';
import { setNestedIndex } from '../../../../Scripts/Modify';

/**
 * Function to increment the position of the comment
 * @param parentCommentObj - The parent comment object
 * @param commentObjIndex - The index of the comment object
 * @param commentLevel - The level of the comment
 */
function incrementComment(
  parentCommentObj: BaseCommentType[] | ReplyCommentType[],
  commentObjIndex: number,
  commentLevel: number,
) {
  // Loop through the comments and sort them based on the score
  // starting with the child comments position and go up
  // till the first comment position
  for (let i = commentObjIndex - 1; i >= 1; i--) {
    const previousMessage = parentCommentObj[i - 1];
    const currentMessage = parentCommentObj[i];
    // Check if the current message has a higher score than the previous message
    if (previousMessage.score >= currentMessage.score) return;
    // Swap the current message position with the previous message position
    const tempPosition = positionIdGenerator.getPosition(previousMessage);
    positionIdGenerator.updatePosition(
      previousMessage,
      positionIdGenerator.getPosition(currentMessage),
    );
    positionIdGenerator.updatePosition(currentMessage, tempPosition);
    //  Swap the current index with the previous index
    parentCommentObj[i - 1] = currentMessage;
    parentCommentObj[i] = previousMessage;

    if (previousMessage.replies.length > 0) {
      const position = positionIdGenerator.getPosition(previousMessage);
      setNestedIndex(previousMessage.replies, commentLevel, position.split('.')[commentLevel]);
    }
    if (currentMessage.replies.length > 0) {
      const position = positionIdGenerator.getPosition(currentMessage);
      setNestedIndex(currentMessage.replies, commentLevel, position.split('.')[commentLevel]);
    }
  }
}

/**
 * Helper function to sort the comments based on the score
 * @param commentsArr
 * @param commentObj
 */
export function incrementCommentHelper(
  commentsArr: BaseCommentType[],
  commentObj: BaseCommentType | ReplyCommentType,
) {
  // The last index of the position is the index of the comment in the array
  const commentPosition = positionIdGenerator.getPosition(commentObj);
  const commentPositionArr = commentPosition.split('.');
  const commentLevel = commentPositionArr.length - 1;
  const commentObjIndex = parseInt(commentPositionArr[commentLevel], 10);
  // If index is greater than 1 then sort the comments as position is 1 based
  // else return as the comment is the first comment in the hierarchy
  if (commentObjIndex === 1) return;

  // Find the parent comment of the comment
  const commentParentObj = findParentComment(commentsArr, commentPosition);

  // If the parent comment is base comment pass the comments array
  // else pass the replies array of the parent comment
  if (commentLevel === 0) {
    incrementComment(commentsArr, commentObjIndex, commentLevel);
    // console.log(commentsArr);
    // console.log(positionIdGenerator.positionMap);
  } else {
    incrementComment(commentParentObj.replies, commentObjIndex, commentLevel);
    // console.log(commentsArr);
    // console.log(positionIdGenerator.positionMap);
  }
}
