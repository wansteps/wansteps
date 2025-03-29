import { Outlet } from "@remix-run/react"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="md:w-[540px] w-full px-4 py-12">
        <div className="relative mx-auto grid gap-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Auth() {
    return (
        <div className="flex items-center justify-center min-h-dvh">
      <div className="md:w-[540px] w-full px-4 py-12">
        <div className="relative mx-auto grid gap-6">
          <Outlet />
        </div>
      </div>
    </div>
    );
}
