import type { BaseCommentType, ReplyCommentType } from '../../../../scripts/data/data-store_types';
import { positionIdGenerator } from '../../../../../scripts/RandomGenerator';
import { findParentComment } from '../../../../scripts/CommentsHelper';
import { setNestedIndex } from '../../../../scripts/Modify';

/**
 * Function to increment the position of the comment
 * @param parentCommentObj - The parent comment object
 * @param commentObjIndex - The index of the comment object
 * @param commentLevel - The level of the comment
 */
function decrementComment(
  parentCommentObj: BaseCommentType[] | ReplyCommentType[],
  commentObjIndex: number,
  commentLevel: number,
) {
  // Loop through the comments and sort them based on the score
  // starting with the child comments position and go down
  // till the last comment position
  for (let i = commentObjIndex - 1; i < parentCommentObj.length - 1; i++) {
    const currentMessage = parentCommentObj[i];
    const nextMessage = parentCommentObj[i + 1];
    // Check if the current message has a higher score than the next message
    if (currentMessage.score >= nextMessage.score) return;
    // Swap the current message position with the previous message position
    const tempPosition = positionIdGenerator.getPosition(nextMessage);
    positionIdGenerator.updatePosition(
      nextMessage,
      positionIdGenerator.getPosition(currentMessage),
    );
    positionIdGenerator.updatePosition(currentMessage, tempPosition);
    //  Swap the current index with the previous index
    parentCommentObj[i] = nextMessage;
    parentCommentObj[i + 1] = currentMessage;

    if (nextMessage.replies.length > 0) {
      const position = positionIdGenerator.getPosition(nextMessage);
      setNestedIndex(nextMessage.replies, commentLevel, position.split('.')[commentLevel]);
      // console.log(commentLevel, position.split('.')[commentLevel]);
    }
    if (currentMessage.replies.length > 0) {
      const position = positionIdGenerator.getPosition(currentMessage);
      setNestedIndex(currentMessage.replies, commentLevel, position.split('.')[commentLevel]);
      // console.log(commentLevel, position.split('.')[commentLevel]);
    }
  }
}

/**
 * Helper function to sort the comments based on the score
 * @param commentsArr
 * @param commentObj
 */
export function decrementCommentHelper(
  commentsArr: BaseCommentType[],
  commentObj: BaseCommentType | ReplyCommentType,
) {
  // The last index of the position is the index of the comment in the array
  // console.log(commentObj.position);
  // console.log(positionIdGenerator.positionMap);
  const commentPosition = positionIdGenerator.getPosition(commentObj);
  const commentPositionArr = commentPosition.split('.');
  const commentLevel = commentPositionArr.length - 1;
  const commentObjIndex = parseInt(commentPositionArr[commentLevel], 10);
  // Find the parent comment of the comment
  const parentObj = findParentComment(commentsArr, commentPosition);
  // Check if the comments position is last in the replies array
  // if so return as the comment cannot move further down the chain
  if (commentObjIndex === parentObj.replies.length) return;

  // If the parent comment is base comment pass the comments array
  // else pass the replies array of the parent comment
  if (commentLevel === 0) {
    decrementComment(commentsArr, commentObjIndex, commentLevel);
    // console.log(commentsArr);
    // console.log(positionIdGenerator.positionMap);
  } else {
    decrementComment(parentObj.replies, commentObjIndex, commentLevel);
    // console.log(commentsArr);
    // console.log(positionIdGenerator.positionMap);
  }
}
