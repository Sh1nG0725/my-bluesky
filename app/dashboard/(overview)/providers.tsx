"use client";

import { useSearchParams } from "next/navigation";
import { Props } from "next/script";
import { FC, useEffect } from "react";
import { toast } from "react-toastify";

export const Providers: FC<Props> = ({ children }) => {
  const searchParams = useSearchParams();
  const post = searchParams.get("post");
  useEffect(() => {
    if (post) {
      toast.info("ポストしました");
    }  
  },[])

  return (
    <main>
      {children}
    </main>
  );
}
