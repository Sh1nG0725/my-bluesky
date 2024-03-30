import {
  UsersIcon,
  UserPlusIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { notoSansJP } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  users: UsersIcon,
  userplus: UserPlusIcon,
  pencil: PencilSquareIcon,
};

export default async function CardWrapper() {
  const {
    numberOfFollowers,
    numberOfFollowing,
    numberofPost,
  } = await fetchCardData();

  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}
      <Card title="Followers" value={numberOfFollowers} type="users" />
      <Card title="Following" value={numberOfFollowing} type="userplus" />
      <Card title="Post" value={numberofPost} type="pencil" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'users' | 'userplus' | 'pencil';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${notoSansJP.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
