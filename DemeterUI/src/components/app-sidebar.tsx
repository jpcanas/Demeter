import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Settings2,
  SquareTerminal,
  PieChart,
  Kanban,
} from "lucide-react";

import { NavUser } from "@/components/sideBarNav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavCollapsible } from "./sidebarNav-collapsible";
import { NavPrimary } from "./sidebarNav-primary";

// This is sample data.
const data = {
  user: {
    name: "mobius",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
  ],
  navPrimary: [
    {
      title: "Kanban Board",
      url: "/kanban",
      icon: Kanban,
    },
    {
      title: "File Uploader",
      url: "/fileuploader",
      icon: PieChart,
    },
  ],
  navSetting: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Account",
          url: "/settings/account",
        },
        {
          title: "Permissions",
          url: "#",
        },
        {
          title: "Themes",
          url: "#",
        },
        {
          title: "Logs",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-[0.91rem]">
                    Acme Inc
                  </span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <NavCollapsible items={data.navMain} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Custom Components</SidebarGroupLabel>
          <NavPrimary items={data.navPrimary} />
        </SidebarGroup>

        <div className="p-2">
          <NavCollapsible items={data.navSetting} />
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
