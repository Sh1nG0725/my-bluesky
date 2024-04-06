import SideNav from '@/app/ui/dashboard/sidenav';
import { faDove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * ダッシュボードのレイアウト
 * @param param0 
 * @returns レイアウト
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:px-12">
        <div className="flex items-center justify-center">
          <div><FontAwesomeIcon icon={faDove} className="text-blue-600 h-[30px]"/></div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}