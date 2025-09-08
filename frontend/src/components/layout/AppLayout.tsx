// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Header from "./HeaderFixed";
import Footer from "./Footer";
import { useAuthStore } from "@/stores/useAuthStore";

const AppLayout = () => {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);
  return (
    <div>
      <Header />
      <main className="w-full pt-[68px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;

