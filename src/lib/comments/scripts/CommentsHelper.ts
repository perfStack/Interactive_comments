import { generateCurrentUTC } from '../../scripts/DateTime';
import type { BaseCommentType, ReplyCommentType, UserType } from './data/data-store_types';
import { messageIdGenerator, positionIdGenerator } from './data/RandomGenerator';

// todo - updated score to be set to local storage
// todo - update the score to check time when score is a tie

/**
 * function to return the comment Object using the supplied commentId
 * @param commentArr - The array of comments
 * @param commentPositionId - The id of the comment whose object is to be returned
 */
export function findComment(
  commentArr: BaseCommentType[],
  commentPositionId: number,
): BaseCommentType | ReplyCommentType {
  try {
    // Split the comment as it can be a nested one, with each number denoting the nested index.
    // eg 1.4.3
    const commentPosition = positionIdGenerator.getPosition(commentPositionId);
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
    // until the (last index)[parentComment] is reached
    if (commentIdArr.length > 1) {
      for (let i = 1; i < commentIdArr.length; i++) {
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

/**
 * Function to delete the current message is as well as position from the Set and Map respectively
 * @param messageObj
 */
function deleteMessageFromMemory(messageObj: BaseCommentType | ReplyCommentType) {
  // Remove the comment id from the available pool of comment ids
  messageIdGenerator.deleteId(messageObj.id);
  // Remove the comment position from the available pool of comment positions
  positionIdGenerator.deletePosition(messageObj.position);
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
    deleteMessageFromMemory(commentObj.replies[lastIndex]);
    // Remove the comment from the replies array
    commentObj.replies.splice(lastIndex, 1);
    // Update the remaining comments position to reflect the new position
    moveRemainingPostUp(lastIndex, commentObj);
  } else {
    commentArr.splice(firstIndex, 1);
  }
}

/**
 *  Function to remove a set the message as well as it's content to deleted
 * @param commentArr
 * @param commentPositionId
 */
export function removeCommentConstructively(
  commentArr: BaseCommentType[],
  commentPositionId: number,
) {
  const commentObj = findComment(commentArr, commentPositionId);

  commentObj.isDeleted = true;
  commentObj.content = 'This comment has been deleted';
  commentObj.user = { username: 'Deleted', image: { png: '', webp: '' } };
  // if ('replyingTo' in commentObj) commentObj.replyingTo = 'deleted';

  // Updating the id of the comment is necessary as the id of the comment is used internally,
  // to update the DOM , so the changed attributes are reflected in the DOM.
  messageIdGenerator.updateId(commentObj);
}

/**
 * Function to update the new comment.position as well as comment.id
 * of the remaining comments in the array.
 * @param indexToStart - The position of the deleted comment
 * @param commentObj - The parent comment containing the comment to modify
 * @param position - The position of the comment to move up
 */
function moveRemainingPostUp(indexToStart: number, commentObj: BaseCommentType, position = 1) {
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
      reply[reply.length - position] = (
        parseInt(reply[reply.length - position], 10) - 1
      ).toString();
      positionIdGenerator.updatePosition(commentObj.replies[i], reply.join('.'));

      // Recursive call to update the nested comments
      // Increase the position by 1 to move up the nested comments position as
      // only the parent's position has changed eg 2.2 -> 2.1, 2.2.2 -> 2.1.2 ✔️
      // otherwise the nested comments will be moved eg 2.2 -> 2.1, 2.2.2 -> 2.2.1 ❌
      if (commentObj.replies[i].replies.length > 0) {
        moveRemainingPostUp(0, commentObj.replies[i], position + 1);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Function to generate a new comment
 * @param currentUserData - The current user data
 * @param msgContent - The message content
 * @param parentPositionId - The position of the parent comment if any else null
 * @param existingComments - The no of existing comments on a particular level
 * @param replyingToUserName - The user name of the user who is replying to
 * @returns newComment - The new comment object
 */
export function generateNewComment(
  currentUserData: UserType,
  msgContent: string,
  parentPositionId: number | null,
  existingComments: number,
  replyingToUserName?: string,
): ReplyCommentType | BaseCommentType {
  try {
    let finalComment: BaseCommentType | ReplyCommentType | undefined;
    let parentPosition: string;
    // position is 1 based, so we need to add 1 to the no of existing comments
    const commentPosition = existingComments + 1;
    if (parentPositionId) {
      parentPosition = positionIdGenerator.getPosition(parentPositionId);
    } else {
      parentPosition = '';
    }

    const newCommentSkeleton = {
      id: messageIdGenerator.generateId(),
      isDeleted: false,
      content: msgContent,
      user: currentUserData,
      createdAt: 'now',
      createdAtDate: generateCurrentUTC(),
      score: 0,
      replies: [],
    };

    // If the comment has replyingTo, then it is a reply comment
    if (replyingToUserName) {
      const replyComment = {
        ...newCommentSkeleton,
        position: positionIdGenerator.generateIdAndPosition(
          parentPosition,
          existingComments + 1,
          false,
        ),
        replyingTo: replyingToUserName,
      };
      finalComment = replyComment;
    }

    // If the comment is not a reply, then it is a base comment.
    // If earlier it was a found to be a reply comment, then skip this step.
    if (!finalComment) {
      const newBaseComment: BaseCommentType = {
        ...newCommentSkeleton,
        position: positionIdGenerator.generateIdAndPosition(parentPosition, commentPosition, true),
      };
      finalComment = newBaseComment;
    }

    // If the comment is neither a reply nor a base comment, then throw an error.
    if (!finalComment) throw new Error('Comment not generated');
    return finalComment;
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
