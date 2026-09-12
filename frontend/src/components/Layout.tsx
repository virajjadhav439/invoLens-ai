import {
  NavLink,
  Outlet
} from "react-router-dom";

import {
  LayoutDashboard,
  Upload,
  FileText,
  Sparkles,
  Bell,
  ChevronDown
} from "lucide-react";
import AIEngineBadge from "./AIEngineBadge";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  },
  {
    name: "Upload Invoice",
    path: "/upload",
    icon: Upload
  },
  {
    name: "Invoice History",
    path: "/invoices",
    icon: FileText
  }
];

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Desktop Sidebar */}

      <aside className="
        fixed
        inset-y-0
        left-0
        z-40
        hidden
        w-64
        border-r
        border-slate-200/80
        bg-white/90
        backdrop-blur-xl
        lg:flex
        lg:flex-col
      ">

        {/* Logo */}

        <div className="flex h-20 items-center px-6">

          <div className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-linear-to-br
            from-indigo-500
            to-blue-600
            text-lg
            font-bold
            text-white
            shadow-lg
            shadow-indigo-500/20
          ">
            I
          </div>

          <div className="ml-3">
            <div className="text-[15px] font-bold tracking-tight">
              InvoLens
            </div>

            <div className="text-[10px] font-medium text-slate-400">
              INVOICE INTELLIGENCE
            </div>
          </div>

        </div>

        {/* Navigation */}

        <div className="px-4">

          <p className="
            mb-3
            px-3
            text-[10px]
            font-bold
            uppercase
            tracking-[0.15em]
            text-slate-400
          ">
            Workspace
          </p>

          <nav className="space-y-1">

            {navigation.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) => `
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-md
                    font-medium
                    transition-all
                    ${
                      isActive
                        ? `
                          bg-indigo-50
                          text-indigo-700
                          shadow-sm
                        `
                        : `
                          text-slate-500
                          hover:bg-slate-50
                          hover:text-slate-900
                        `
                    }
                  `}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                  />

                  {item.name}
                </NavLink>
              );
            })}

          </nav>

        </div>

        {/* AI Status */}

        <div className="mt-auto p-4">
  <AIEngineBadge />
</div>

      </aside>

      {/* Main */}

      <div className="lg:pl-64">

        {/* Header */}

        <header className="
          sticky
          top-0
          z-30
          flex
          h-20
          items-center
          justify-between
          border-b
          border-slate-200/80
          bg-white/80
          px-5
          backdrop-blur-xl
          sm:px-8
        ">

          <div>

            <p className="
              hidden
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-indigo-500
              sm:block
            ">
              InvoLens AI
            </p>

            <h1 className="
              text-sm
              font-semibold
              tracking-tight
              text-slate-800
              sm:text-base
            ">
              Turn Every Invoice Into Business Intelligence.
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <button className="
              hidden
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-500
              shadow-sm
              hover:bg-slate-50
              sm:flex
            ">
              <Bell size={17} />
            </button>

            <div className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-2
              py-1.5
              shadow-sm
            ">

              <div className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                bg-slate-900
                text-xs
                font-semibold
                text-white
              ">
                V
              </div>

              <span className="
                hidden
                text-xs
                font-semibold
                text-slate-700
                sm:block
              ">
                Workspace
              </span>

              <ChevronDown
                size={14}
                className="text-slate-400"
              />

            </div>

          </div>

        </header>

        {/* Content */}

        <main className="
          min-h-[calc(100vh-80px)]
          bg-grid
          px-4
          py-6
          sm:px-8
          sm:py-8
        ">

          <div className="
            mx-auto
            max-w-7xl
          ">
            <Outlet />
          </div>

        </main>

      </div>

      {/* Mobile Bottom Nav */}

      <nav className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        flex
        border-t
        border-slate-200
        bg-white/95
        px-2
        py-2
        backdrop-blur-xl
        lg:hidden
      ">

        {navigation.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) => `
                flex
                flex-1
                flex-col
                items-center
                gap-1
                py-1
                text-[10px]
                font-medium
                ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400"
                }
              `}
            >
              <Icon size={19} />
              {item.name.split(" ")[0]}
            </NavLink>
          );
        })}

      </nav>

    </div>
  );
};

export default Layout;