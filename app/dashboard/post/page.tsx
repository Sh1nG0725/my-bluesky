import { notoSansJP } from '@/app/ui/fonts';
import Form from '@/app/ui/post/create-form';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export default async function Page() {
  return (
    <main>
      <div className="flex mb-4 items-center">
        <PencilSquareIcon className="w-6 text-gray-700" />
        <h1 className={`${notoSansJP.className} ml-2 text-xl md:text-2xl text-gray-700`}>
          Post
        </h1>
      </div>
      <Form />
    </main>
  );
}