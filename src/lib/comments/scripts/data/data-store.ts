import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { BaseCommentType, UserType } from './data-store_types';

import { LOCAL_STORAGE_KEY } from '../../../scripts/config/LocalStorageKeys';
import {
  getDataFromLocalStorage,
  NoLocalStorageError,
  setDataToLocalStorage,
} from '../../../scripts/LocalStorage';

// Image imports
import amyrobsonPng from '$lib/assets/img/avatars/image-amyrobson.png';
import amyrobsonWebp from '$lib/assets/img/avatars/image-amyrobson.webp';
import juliusomoPng from '$lib/assets/img/avatars/image-juliusomo.png';
import juliusomoWebp from '$lib/assets/img/avatars/image-juliusomo.webp';
import maxblagunPng from '$lib/assets/img/avatars/image-maxblagun.png';
import maxblagunWebp from '$lib/assets/img/avatars/image-maxblagun.webp';
import ramsesmironPng from '$lib/assets/img/avatars/image-ramsesmiron.png';
import ramsesmironWebp from '$lib/assets/img/avatars/image-ramsesmiron.webp';
// Image imports

const hardCodedData: {
  currentUser: UserType;
  comments: BaseCommentType[];
} = {
  currentUser: {
    image: {
      png: juliusomoPng,
      webp: juliusomoWebp,
    },
    username: 'juliusomo',
  },
  comments: [
    {
      id: 9625,
      position: 19625,
      isDeleted: false,
      content:
        // eslint-disable-next-line max-len
        "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      createdAt: '1 month ago',
      createdAtDate: new Date(Date.UTC(2022, 5, 5, 3, 4, 5)).valueOf(),
      score: 12,
      user: {
        image: {
          png: amyrobsonPng,
          webp: amyrobsonWebp,
        },
        username: 'amyrobson',
      },
      replies: [],
    },
    {
      id: 9589,
      position: 19589,
      isDeleted: false,
      content:
        // eslint-disable-next-line max-len
        "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      createdAt: '2 weeks ago',
      createdAtDate: new Date(Date.UTC(2022, 5, 21, 3, 4, 5)).valueOf(),
      score: 5,
      user: {
        image: {
          png: maxblagunPng,
          webp: maxblagunWebp,
        },
        username: 'maxblagun',
      },
      replies: [
        {
          id: 4091,
          position: 14091,
          isDeleted: false,
          content:
            // eslint-disable-next-line max-len
            "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          createdAt: '1 week ago',
          createdAtDate: new Date(Date.UTC(2022, 5, 28, 3, 4, 5)).valueOf(),
          score: 4,
          replyingTo: 'maxblagun',
          user: {
            image: {
              png: ramsesmironPng,
              webp: ramsesmironWebp,
            },
            username: 'ramsesmiron',
          },
          replies: [],
        },
        {
          id: 5068,
          position: 15068,
          isDeleted: false,
          content:
            // eslint-disable-next-line max-len
            "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
          createdAt: '2 days ago',
          createdAtDate: new Date(Date.UTC(2022, 6, 3, 3, 4, 5)).valueOf(),
          score: 2,
          replyingTo: 'maxblagun',
          user: {
            image: {
              png: juliusomoPng,
              webp: juliusomoWebp,
            },
            username: 'juliusomo',
          },
          replies: [],
        },
        {
          id: 7718,
          position: 17718,
          isDeleted: false,
          content:
            // eslint-disable-next-line max-len
            'Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.',
          createdAt: '1 day ago',
          createdAtDate: new Date(Date.UTC(2022, 6, 4, 3, 4, 5)).valueOf(),
          score: 6,
          replyingTo: 'maxblagun',
          user: {
            image: {
              png: juliusomoPng,
              webp: juliusomoWebp,
            },
            username: 'juliusomo',
          },
          replies: [],
        },
      ],
    },
  ],
};

// export const commentsStore = writable(hardCodedData);
export let currentUserStore: Writable<UserType>;
export let commentsStore: Writable<BaseCommentType[]>;

/**
 * Function to initialize data either from local storage or hard coded data.
 */
function init() {
  const instData = initialStoreData();
  let currentUserData;
  let commentsData;
  if (instData) {
    const [currUserData, cmmntsData] = instData;
    currentUserData = currUserData;
    commentsData = cmmntsData;
  } else {
    currentUserData = hardCodedData.currentUser;
    commentsData = hardCodedData.comments;
  }

  currentUserStore = writable(currentUserData);
  commentsStore = writable(commentsData);
}

init();

/**
 * Function to initialize the store data.
 * @returns {[UserType, CommentDataType]}
 */
function initialStoreData(): [UserType, BaseCommentType[]] | undefined {
  try {
    const localRawCmntsData = getDataFromLocalStorage(LOCAL_STORAGE_KEY.commentsData);
    const localRawUsrData = getDataFromLocalStorage(LOCAL_STORAGE_KEY.currentUser);
    const localUsrData: UserType | undefined = localRawUsrData && JSON.parse(localRawUsrData);
    const localCmntsData: BaseCommentType[] | undefined =
      localRawCmntsData && JSON.parse(localRawCmntsData);

    if (localUsrData && localCmntsData) {
      return [localUsrData, localCmntsData];
    } else {
      if (localStorage) {
        setDataToLocalStorage(
          LOCAL_STORAGE_KEY.currentUser,
          JSON.stringify(hardCodedData.currentUser),
        );
        setDataToLocalStorage(
          LOCAL_STORAGE_KEY.commentsData,
          JSON.stringify(hardCodedData.comments),
        );
      }
      return [hardCodedData.currentUser, hardCodedData.comments];
    }
  } catch (error) {
    if (error instanceof NoLocalStorageError) {
      console.error(error);
    }
  }
}
