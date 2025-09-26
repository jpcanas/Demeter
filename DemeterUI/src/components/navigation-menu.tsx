import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { BellRing, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import NotifPopOver from "./notif-popOver";
import AccountPopOver from "./account-popOver";
import { useTheme } from "../context/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useLocation } from "react-router";

export default function NavigationMenu() {
  const { setTheme } = useTheme();

  // let location = useLocation();

  // let pathAddress = location.pathname.split("/");
  // console.log("path", location.pathname);
  // console.log(pathAddress);

  return (
    <header className="flex sticky top-0 bg-background h-16 border-b px-4">
      <div className="flex flex-1 ">
        <div className="flex grow items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Sales Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <span className="flex h-2.5 w-2.5 translate-y-1 rounded-full bg-destructive absolute top-0 left-6" />
                <BellRing className="cursor-pointer" size="18" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2" align="end" sideOffset={6}>
              <NotifPopOver />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="size-9 ms-1">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="cursor-pointer"
                />
                <AvatarFallback>JC</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end" sideOffset={6}>
              <AccountPopOver />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
