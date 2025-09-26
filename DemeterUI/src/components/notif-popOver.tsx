import { Button } from "@/components/ui/button";

import { Eye } from "lucide-react";
import { Separator } from "./ui/separator";

const notifications = [
  {
    title: "Your call has been confirmed. You must reply within 25 days",
    description: "Just now",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

const viewAll = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();
  alert("View all notif");
};

export default function NotifPopOver() {
  return (
    <>
      <div className="px-2 pt-0 pb-2">
        <p className="text-lg font-semibold text-primary">Notifications</p>
        <p className="text-sm">You have 3 unread messages</p>
      </div>
      <Separator className="mb-3" />
      <div className="grid gap-3 p-0">
        <div>
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="mb-1 grid grid-cols-[25px_1fr] items-start py-2 last:mb-2 last:pb-2 cursor-pointer px-2 hover:bg-muted"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-secondary" />
              <div className="space-y-1 ">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Separator className="" />
      <div className="py-1">
        <Button className="w-full" variant="ghost" onClick={viewAll}>
          <Eye /> View all
        </Button>
        {/* <Button className="w-full">
          <Check /> Mark all as read
        </Button> */}
      </div>
    </>
  );
}
