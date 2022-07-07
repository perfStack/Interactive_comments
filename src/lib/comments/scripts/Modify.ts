import type { BaseCommentType, ReplyCommentType } from './data/data-store_types';
import { positionIdGenerator } from '../../scripts/RandomGenerator';

/**
 * Function to modify base comments as well as its replies position
 * @param commentsArr - The array of comments
 * @param parentPosition - The position of the parent comment denotes which level must be updated
 * @param increment - Decides whether to increment or decrement the position
 */
export function modifyNestedIndex(
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
export function setNestedIndex(
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
    // console.log(parentPosition, parentIndex);
    commentPosArr[parentPosition] = parentIndex;
    positionIdGenerator.updatePosition(comment, commentPosArr.join('.'));
    // console.log(comment.position);

    while (comment.replies.length > 0) {
      setNestedIndex(comment.replies, parentPosition, parentIndex);
    }
  }
}
