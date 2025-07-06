import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import type { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode;
  showsidebar?: boolean;
}

const Layout = ({ children, showsidebar = false }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {showsidebar && <Sidebar />}
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout