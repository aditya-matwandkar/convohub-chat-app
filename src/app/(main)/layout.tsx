import NavSideBar from "@/components/navbar/nav-sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="w-[72px] hidden md:flex z-50 flex-col fixed inset-y-0">
        <NavSideBar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
}
