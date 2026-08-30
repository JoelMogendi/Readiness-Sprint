'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

type UserState = {
  id: string;
  name: string;
  role: "RETAILER" | "DISPATCHER" | "RIDER";
};

export default function Navbar() {
  const [user, setUser] = useState<UserState | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check Auth State on Mount and Route Change
  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user data");
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null);
    router.push("/login");
  };

  // Prevent hydration mismatch on initial load
  if (!isClient) return <header className="h-16 px-8 border-b border-zinc-800 bg-zinc-950"></header>;

  return (
    <header className="h-16 px-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 text-zinc-50">
      <Link href="/" className="font-bold tracking-tight">
        Reflex
      </Link>
      
      <nav className="flex items-center gap-6 text-sm text-zinc-400">
        <Link href="/" className="hover:text-zinc-100 transition-colors">
          Home
        </Link>

        {/* Dynamic Links Based on Role */}
        {user?.role === "RETAILER" && (
          <Link href="/retailer" className="hover:text-zinc-100 transition-colors">
            Retailer Dashboard
          </Link>
        )}
        
        {user?.role === "DISPATCHER" && (
          <Link href="/dispatcher" className="hover:text-zinc-100 transition-colors">
            Dispatcher Board
          </Link>
        )}

        {user?.role === "RIDER" && (
          <Link href="/rider" className="hover:text-zinc-100 transition-colors">
            My Deliveries
          </Link>
        )}

        {/* Always show Sync + Scanning for now, or restrict to a specific role later */}
        <Link href="/scanner" className="hover:text-zinc-100 transition-colors">
          Sync + Scanning
        </Link>
        
        {/* Auth Controls */}
        <div className="ml-4 pl-4 border-l border-zinc-800 flex items-center gap-4">
          {user ? (
            <>
              <span className="text-zinc-300">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/" className="text-zinc-50 hover:text-zinc-300 transition-colors font-medium">
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}