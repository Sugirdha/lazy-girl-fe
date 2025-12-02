import { Outlet } from "react-router-dom";
import Header from "./planner/Header";

function Layout() {
  return (
    <div className="min-h-screen bg-[#fbeee7] flex items-center justify-center">
      <div className="relative w-full max-w-[420px] tablet:max-w-[480px] desktop:max-w-[600px] min-h-[640px] bg-white/30 rounded-[32px] overflow-hidden">
        <div className="pt-12 px-6">
          <Header title="LazyGirl" subtitle="Meal planner" />
        </div>
        <main className="px-6 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;