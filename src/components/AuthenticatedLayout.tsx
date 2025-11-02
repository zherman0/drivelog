import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
};
