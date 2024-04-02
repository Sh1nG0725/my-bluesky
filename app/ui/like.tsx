"use client"

import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline} from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useState } from 'react';
import React from 'react';
import { likeClick } from '../lib/likeClick';
import { LatestPost } from '../lib/definitions';

export function Like({post, items, setItems}: {
  post: LatestPost;
  items: LatestPost[][];
  setItems: Dispatch<SetStateAction<LatestPost[][]>>;
}) {
  const [isLike, setLike] = useState((post.like) ? true : false);
  
  async function handleClick() {
    const response = await likeClick(post.like, post.uri, post.cid);
    const nextShapes = items.map(it => {
      const nextShapes = it.map(pt => {
        if (pt.uri === post.uri) {
          if (response) {
            pt.like = response['uri'];
          } else {
            pt.like = "";
          }
          return pt;
        }
      });
    });
    setItems(items);
    setLike(isLike => !isLike);
  }
  return (
    <>
    {!post.like ? 
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