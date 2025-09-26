import { BadgeCheck, CreditCard, LogOut } from "lucide-react";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router";

export default function AccountPopOver() {
  const navigateLogin = useNavigate();
  const handleLogout = () => {
    navigateLogin("authenticate/login");
  };
  return (
    <>
      <div className="px-2 pt-0 pb-2">
        <p className="text-lg font-semibold">Harry Potter</p>
        <p className="text-sm">harryPotter@gmail.com</p>
      </div>
      <Separator />
      <div className="grid gap-4 p-0">
        <div className="flex flex-col last:mb-2 first:mt-2">
          <div className="flex gap-2 hover:bg-muted/50 cursor-pointer ps-2 py-2 items-center">
            <BadgeCheck size="16" />
            <p className="text-sm">Account</p>
          </div>
          <div className="flex gap-2 hover:bg-muted/50 cursor-pointer ps-2 py-2 items-center">
            <CreditCard size="16" />
            <p className="text-sm">Billing</p>
          </div>
          <div
            className="flex gap-2 hover:bg-muted/50 cursor-pointer ps-2 py-2 items-center"
            onClick={handleLogout}
          >
            <LogOut size="16" />
            <p className="text-sm">Log out</p>
          </div>
        </div>
      </div>
    </>
  );
}
