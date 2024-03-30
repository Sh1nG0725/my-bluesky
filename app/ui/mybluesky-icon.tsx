import { auth } from '@/auth';
import Image from 'next/image'

export default async function MyBlueSkyIcon() {
  const session = await auth();
  //console.log(session);
  return (
    <div style={{position: 'relative'}}>
      <Image
        src={session?.user?.image_url || ""} 
        alt="image description" 
        className="mr-4 rounded-full"
        width={50}
        height={50}
        style={{float: 'left'}}
      />
      <div><strong>{session?.user?.displayName || ""}</strong></div>
      <div style={{fontSize : '.8rem'}}>{session?.user?.handle || ""}</div>
    </div>
  );
}
