import React from "react";

import NavSideBar from "./navbar/nav-sidebar";
import SpaceSidebar from "./space/space-sidebar";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export default function MobileToggle({ spaceId }: { spaceId: string }) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex gap-0">
          <div className="w-[72px]">
            <NavSideBar />
          </div>
          <SpaceSidebar spaceId={spaceId} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
