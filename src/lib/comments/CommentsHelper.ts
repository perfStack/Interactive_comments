import type { BaseCommentType, ReplyCommentType, UserType } from '$lib/data/data-store_types';
import { messageIdGenerator, positionIdGenerator } from '../data/RandomGenerator';

/**
 * function to return the comment Object using the supplied commentId
 * @param commentArr - The array of comments
 * @param commentPositionId - The id of the comment whose object is to be returned
 */
export function findComment(
    commentArr: BaseCommentType[],
    commentPositionId: number,
): [BaseCommentType | ReplyCommentType, boolean] {
  try {
    // Split the comment as it can be a nested one, with each number denoting the nested index.
    // eg 1.4.3
    const commentPosition = positionIdGenerator.getPosition(commentPositionId);
    const commentIdArr = commentPosition.split('.');
    // Check if the index of base message checks out ot be valid in existing arr
    // as no nested message will be found without a valid base message
    // parseInt() - 1 cause id start from 1
    const messageIndex = parseInt(commentIdArr[0], 10) - 1;
    const baseCommentObj = commentArr[messageIndex];

    // This is for any nested comment to be found
    let commentObj: ReplyCommentType | undefined;

    // Check if no base comment(comment with depth=1 i.e. no nested comment) then trow new Error
    if (!baseCommentObj) throw new Error(`Can't find any base comment with id ${commentIdArr[0]}`);

    // Check if the id relates to a nested comment if so then use the baseCommentObj found earlier,
    // use the replies' property to traverse to the nested message,
    // all further message will be replies
    if (commentIdArr.length > 1) {
      for (let i = 1; i < commentIdArr.length; i++) {
        const messageIndex = parseInt(commentIdArr[i], 10) - 1;
        commentObj = baseCommentObj.replies[messageIndex];
        if (!commentObj) {
          throw new Error(
              `Can't find nested comment ${commentPosition[i]} with id ${commentPosition}`,
          );
        }
      }
    }
    return commentObj ? [commentObj, true] : [baseCommentObj, false];
  } catch (error) {
    throw error;
  }
}

/**
 * Function to find the last parent of the provided commentPosition
 * @param commentArr - The array of comments
 * @param commentPosition - The id of the comment whose parent is to be found
 * @returns
 */
function findParentComment(
    commentArr: BaseCommentType[],
    commentPosition: string,
): BaseCommentType | ReplyCommentType {
  // Split the comment as it can be a nested one, with each number denoting the nested index.
  // eg 1.4.3
  const commentIdArr = commentPosition.split('.');
  // Check if the index of base message checks out ot be valid in existing arr
  // as no nested message will be found without a valid base message
  // parseInt() - 1 cause id start from 1
  const firstIndex = parseInt(commentIdArr[0], 10) - 1;
  // This is for any nested comment to be found
  let commentObj = commentArr[firstIndex];

  // Check if no base comment(comment with depth=1 i.e. no nested comment) then trow new Error
  if (!commentObj) throw new Error(`Can't find any base comment with id ${commentIdArr[0]}`);

  // Check if the id relates to a nested comment if so then loop through the replies' property,
  // until the (last index - 1)[parentComment] is reached
  if (commentIdArr.length > 1) {
    for (let i = 1; i < commentIdArr.length - 1; i++) {
      const messageIndex = parseInt(commentIdArr[i], 10) - 1;
      commentObj = commentObj?.replies[messageIndex];

      if (!commentObj) {
        throw new Error(
            `Can't find nested comment ${commentPosition[i]} with id ${commentPosition}`,
        );
      }
    }
  }

  // Check if the comment is a reply comment or a base comment and return the comment object
  return commentObj;
}

/**
 * Function to remove a comment from the comments array.
 * @param commentArr - The array of comments
 * @param commentPosition Unique id of the comment to be removed
 */
export function removeComment(commentArr: BaseCommentType[], commentPosition: string) {
  // Split the comment as it can be a nested one, with each number denoting the nested index.
  // eg 1.4.3
  const commentIdArr = commentPosition.split('.');
  const isBaseComment = commentIdArr.length === 1;
  // Check if the index of base message checks out ot be valid in existing arr
  // as no nested message will be found without a valid base message
  // parseInt() - 1 cause id start from 1
  const firstIndex = parseInt(commentIdArr[0], 10) - 1;
  const lastIndex = parseInt(commentIdArr[commentIdArr.length - 1], 10) - 1;
  // This is for any nested comment to be found
  const commentObj = findParentComment(commentArr, commentPosition);

  // Remove the comment from the array, check if a valid reply comment was found
  // if so then remove from the replies array or else look for the base comment and remove it.
  // WARNING - This is a very dangerous operation, as it will remove the parent comment
  // from the array as well as remove the entire nested comment array.
  if (!isBaseComment) {
    // Remove the comment id from the available pool
    messageIdGenerator.deleteId(commentObj.replies[lastIndex].id);
    // Remove the comment from the replies array
    commentObj.replies.splice(lastIndex, 1);
    // Update the remaining comments position to reflect the new position
    moveRemainingPostUp(lastIndex, commentObj);
  } else {
    commentArr.splice(firstIndex, 1);
  }
}

/**
 * Function to update the new comment.position as well as comment.id
 * of the remaining comments in the array.
 * @param indexToStart - The position of the deleted comment
 * @param commentObj
 */
function moveRemainingPostUp(indexToStart: number, commentObj: BaseCommentType) {
  try {
    // Start from the position of the last index(position which belonged to the deleted comment)
    // loop through the messages from there on and decrement the message.id by 1
    for (let i = indexToStart; i < commentObj.replies.length; i++) {
      const replyPosition = positionIdGenerator.getPosition(commentObj.replies[i]);

      const reply = replyPosition.split('.');
      // Updating the id of the comment is necessary as the id of the comment is used internally,
      // to update the DOM , so the changed attributes are reflected in the DOM.
      messageIdGenerator.updateId(commentObj.replies[i]);
      // Update the position of the comment
      // Decrement the last index by 1 and then convert it to string and then join it back with '.'
      reply[reply.length - 1] = (parseInt(reply[reply.length - 1], 10) - 1).toString();
      // commentObj.replies[i].position = reply.join('.');
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Function to return a new comment object with the provided content
 * @param commentParent
 * @param currentUserData
 * @param msgContent
 */
export function generateNewComment(
    commentParent: BaseCommentType | ReplyCommentType,
    currentUserData: UserType,
    msgContent: string,
): ReplyCommentType {
  try {
    return {
      id: messageIdGenerator.generateId(),
      position: positionIdGenerator.generateIdAndPosition(commentParent),
      content: msgContent,
      user: currentUserData,
      createdAt: 'now',
      score: 0,
      replies: [], // empty array for replies
      replyingTo: commentParent.user.username,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Function to modify base comments as well as its replies position
 * @param commentsArr - The array of comments
 * @param parentPosition - The position of the parent comment denotes which level must be updated
 * @param increment - Decides whether to increment or decrement the position
 */
function modifyNestedIndex(
    commentsArr: BaseCommentType[] | ReplyCommentType[],
    parentPosition = 0,
    increment = true,
) {
  for (const commentParentElement of commentsArr) {
    const currentPosition = positionIdGenerator.getPosition(commentParentElement);
    const currentObjLevel = currentPosition.split('.')[parentPosition];
    if (currentObjLevel === '1' && !increment) return;

    const modifier = increment ? 1 : -1;
    console.log(commentParentElement.position, parentPosition);
    const parentIndex = currentPosition.split('.');
    parentIndex[parentPosition] = (parseInt(parentIndex[parentPosition], 10) + modifier).toString();
    positionIdGenerator.updatePosition(commentParentElement, parentIndex.join('.'));
    console.log(commentParentElement.position);

    while (commentParentElement.replies.length > 0) {
      modifyNestedIndex(commentParentElement.replies);
    }
  }
}

/**
 * Function to set the changed parent index to its child comments
 * @param commentsArr - The array of comments
 * @param parentPosition - The position of the parent comment denotes which level must be updated
 * @param parentIndex - The new index of the parent comment
 */
function setNestedIndex(
    commentsArr: BaseCommentType[] | ReplyCommentType[],
    parentPosition: number,
    parentIndex: string,
) {
  for (const comment of commentsArr) {
    // const commentPosArr = comment.position.split('.');
    // commentPosArr[parentPosition] = parentIndex;
    // comment.position = commentPosArr.join('.');
    const commentPosition = positionIdGenerator.getPosition(comment);
    const commentPosArr = commentPosition.split('.');
    commentPosArr[parentPosition] = parentIndex;
    positionIdGenerator.updatePosition(comment, commentPosArr.join('.'));
    // console.log(comment.position);

    while (comment.replies.length > 0) {
      setNestedIndex(comment.replies, parentPosition, parentIndex);
    }
  }
}

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
      const position = positionIdGenerator.getPosition(previousMessage);
      setNestedIndex(currentMessage.replies, commentLevel, position.split('.')[commentLevel]);
    }
  }
}

/**
 * Helper function to sort the comments based on the score
 * @param commentsArr
 * @param commentObj
 */
export function sortCommentsHelper(
    commentsArr: BaseCommentType[],
    commentObj: BaseCommentType | ReplyCommentType,
) {
  // The last index of the position is the index of the comment in the array
  console.log(commentObj.position);
  console.log(positionIdGenerator.positionMap);
  const commentPosition = positionIdGenerator.getPosition(commentObj);
  const commentPositionArr = commentPosition.split('.');
  const commentLevel = commentPositionArr.length - 1;
  const commentObjIndex = parseInt(commentPositionArr[commentPositionArr.length - 1], 10);
  // If index is greater than 1 then sort the comments as position is 1 based
  // else return as the comment is the first comment in the hierarchy
  if (commentObjIndex <= 1) return;

  // Find the parent comment of the comment
  const commentParentObj = findParentComment(commentsArr, commentPosition);

  // If the parent comment is base comment pass the comments array
  // else pass the replies array of the parent comment
  if (commentLevel === 0) {
    incrementComment(commentsArr, commentObjIndex, commentLevel);
    console.log(commentsArr);
    console.log(positionIdGenerator.positionMap);
  } else {
    incrementComment(commentParentObj.replies, commentObjIndex, commentLevel);
    console.log(commentsArr);
    console.log(positionIdGenerator.positionMap);
  }
}

/**
 * Function to update the cursor position to the end of the given HTML element
 * @param element
 */
export function moveCursorToTheEnd(element: HTMLElement) {
  // Create a range (a range is a like the selection but invisible)
  const range = document.createRange();
  // Select the entire contents of the element with the range
  range.selectNodeContents(element);
  // collapse the range to the end point. false means collapse to end rather than the start
  range.collapse(false);
  // get the selection object (allows you to change selection)
  const selection = window.getSelection();
  if (!selection) throw new Error('Cannot get selection object');
  // remove any selections already made
  selection.removeAllRanges();
  // make the range you have just created the visible selection
  selection.addRange(range);
}
