import type { BaseCommentType, ReplyCommentType, UserType } from '../../data/data-store_types';
import { messageIdGenerator, positionIdGenerator } from '../../data/RandomGenerator';

// todo - updated score to be set to local storage

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
export function findParentComment(
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

function deleteMessageFromMemory(messageObj: number) {
  // Remove the comment id from the available pool of comment ids
  messageIdGenerator.deleteId(messageObj);
  // Remove the comment position from the available pool of comment positions
  positionIdGenerator.deletePosition(messageObj);
}

/**
 * Function to remove a comment from the comments array.
 * @param commentArr - The array of comments
 * @param commentPositionId Unique position id of the comment to be removed
 */
export function removeComment(commentArr: BaseCommentType[], commentPositionId: string) {
  // Split the comment as it can be a nested one, with each number denoting the nested index.
  // eg 1.4.3
  const commentPosition = positionIdGenerator.getPosition(parseInt(commentPositionId, 10));
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
    // Remove the comment id from the available pool of comment ids
    deleteMessageFromMemory(commentObj.replies[lastIndex].id);
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
