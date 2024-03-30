'use client';

import { useFormState } from 'react-dom';
import { Button } from '@/app/ui/button';
import { createPost } from '@/app/lib/actions';

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createPost, initialState);
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="content"
                name="content"
                type="text"
                placeholder="What's up?"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
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
