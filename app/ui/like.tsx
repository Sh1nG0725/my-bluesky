"use client"

import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline} from '@heroicons/react/24/outline';
import { useState } from 'react';
import React from 'react';
import { likeClick } from '../lib/likeClick';

interface MemoProps {
  like: string,
  uri: string,
  cid: string,
}

export function Like({like, uri, cid}: {
  like: string;
  uri: string;
  cid: string;
}) {
  const [isLike, setLike] = useState((like) ? true : false);
  async function handleClick() {
    await likeClick(like, uri, cid);
    setLike(isLike => !isLike);
  }
  return (
    <>
    {!isLike ? 
      <div className='flex'>
        <div 
          onClick={handleClick}
          className={`flex justify-center items-center w-8 h-8 rounded-full text-gray-500 hover:text-pink-500 hover:bg-pink-200 hover:cursor-pointer`}
        >
          <HeartIconOutline className={`w-5 h-5`} />
        </div>
      </div>
    :
      <div className='flex'>
        <div 
          onClick={handleClick}
          className={`flex justify-center items-center w-8 h-8 rounded-full text-pink-500 hover:bg-pink-200 hover:cursor-pointer`}
        >
          <HeartIconSolid className={`w-5 h-5`} />
        </div>
      </div>
    }
    </>
  );
}