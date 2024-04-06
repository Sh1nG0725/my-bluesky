'use client';

import { useFormState } from 'react-dom';
import { Button } from '@/app/ui/button';
import { createPost } from '@/app/lib/actions';
import { ChangeEvent, useState } from 'react';

/**
 * 投稿フォーム
 * @returns 表示内容
 */
export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createPost, initialState);

  const [count, setCount] = useState(300);
  function changeText(e: ChangeEvent<HTMLTextAreaElement>) {
    setCount(300 - e.target.value.length);
  }

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="content"
                name="content"
                placeholder="最近どう？"
                rows={5}
                onChange={(e) => changeText(e)}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div id="content-error" aria-live="polite" aria-atomic="true">
            {state.errors?.content &&
              state.errors.content.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
          <div className="text-sm text-gray-700">文字数：{count}</div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Post</Button>
      </div>
      <div className="">
        <p className="mt-2 text-sm text-red-500">{state.message}</p>
      </div>
    </form>
  );
}
