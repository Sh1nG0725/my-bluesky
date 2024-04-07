"use client";

import { useSearchParams } from "next/navigation";
import { FC, useEffect } from "react";
import { toast } from "react-toastify";

type Props = {
  children?: React.ReactNode;
};

/**
 * ダッシューボードのプロバイダ
 * @param param0 
 * @returns プロバイダ
 */
export const Providers: FC<Props> = ({ children }) => {
  const searchParams = useSearchParams();
  const post = searchParams.get("post");
  useEffect(() => {
    if (post) {
      toast.info("ポストしました");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <main>
      {children}
    </main>
  );
}
