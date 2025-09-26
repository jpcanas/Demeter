import { type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";

export function NavPrimary({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title}>
            {/* <NavLink
              to={item.url}
              className={`${({ isActive }: { isActive: boolean }) =>
                isActive ? "font-semibold" : undefined}
              text-[0.9rem]`}
            >
              {item.icon && <item.icon />}
              {item.title}
            </NavLink> */}

            <NavLink to={item.url}>
              {({ isActive }) => (
                <>
                  {item.icon && (
                    <item.icon className={isActive ? "text-primary" : ""} />
                  )}
                  <span
                    className={isActive ? "font-semibold text-primary" : ""}
                  >
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
            {/* <a href={item.url}>
              {item.icon && <item.icon />}
              <span
                className={`${
                  item.isActive ? "font-semibold text-primary" : undefined
                }
                    text-[0.9rem]
                    `}
              >
                {item.title}
              </span>
            </a> */}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
