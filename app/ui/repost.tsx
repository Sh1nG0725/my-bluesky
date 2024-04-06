"use client"

import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';
import { Dispatch, SetStateAction, useState } from 'react';
import React from 'react';
import { LatestPost } from '../lib/definitions';
import { repostClick } from '../lib/repostClick';
import { toast } from 'react-toastify';

/**
 * リポストリンク
 * @param param0 
 * @returns リポストリンク
 */
export function Repost({post, items, setItems}: {
  post: LatestPost;
  items: LatestPost[][];
  setItems: Dispatch<SetStateAction<LatestPost[][]>>;
}) {
  const [isRepost, setRepost] = useState((post.repost) ? true : false);
  
  async function handleClick() {
    const response = await repostClick(post.repost, post.uri, post.cid);
    const nextShapes = items[0].map(pt => {
      if (pt.uri === post.uri) {
        if (response) {
          pt.repost = response['uri'];
          toast.info("リポストをしました");
        } else {
          pt.repost = "";
          toast.info("リポストを取り消しました");
        }
        return pt;
      }
    });
    setItems(items);
    setRepost(isRepost => !isRepost);
  }
  return (
    <>
    {!post.repost ? 
      <div className='flex'>
        <div 
          onClick={handleClick}
          className={`flex justify-center items-center w-8 h-8 rounded-full text-gray-500 hover:text-emerald-500 hover:bg-emerald-200 hover:cursor-pointer`}
        >
          <ArrowPathRoundedSquareIcon className={`w-5 h-5`} />
        </div>
      </div>
    :
      <div className='flex'>
        <div 
          onClick={handleClick}
          className={`flex justify-center items-center w-8 h-8 rounded-full text-emerald-500 hover:bg-emerald-200 hover:cursor-pointer`}
        >
          <ArrowPathRoundedSquareIcon className={`w-5 h-5`} />
        </div>
      </div>
    }
    </>
  );
}