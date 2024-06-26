import MyBlueSkyLogo from '@/app/ui/mybluesky-logo';
import LoginForm from '@/app/ui/login-form';

/**
 * ログインページ
 * @returns ページ
 */
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 dark:bg-slate-800 dark:text-white p-3 md:h-36">
          <MyBlueSkyLogo />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}