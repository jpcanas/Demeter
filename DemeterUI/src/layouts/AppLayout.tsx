import { AppSidebar } from "@/components/app-sidebar";
import NavigationMenu from "@/components/navigation-menu";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";

export default function AppLayout() {
  const { accessToken, loadingToken } = useAuth();

  if (loadingToken) return <div className="p-10 text-center">Loading...</div>;

  // useEffect(() => {
  //   console.log("access token", accessToken);
  // }, [accessToken]);

  if (!accessToken) {
    return <Navigate to="authenticate/login" />;
  }
  console.log("accessToken", accessToken);
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <NavigationMenu />

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
