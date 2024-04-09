"use client";

import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

/**
 * テーマプロバイダ
 * @param param0 
 * @returns テーマプロバイダ
 */
export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};