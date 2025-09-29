import Sidebar from "./Sidebar";

export default function AppLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-14">{children}</main>
    </div>
  );
}
