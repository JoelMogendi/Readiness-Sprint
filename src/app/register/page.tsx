'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "RETAILER", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }

      // On successful registration, redirect to the login (landing) page
      router.push("/");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-zinc-950 text-zinc-50 px-4 py-8">
      <div className="w-full max-w-md p-8 border border-zinc-800 rounded-xl bg-zinc-900/50">
        <div className="flex flex-col items-center mb-8">
          <Package className="w-10 h-10 text-blue-500 mb-4" />
          <h1 className="text-2xl font-semibold">Create an Account</h1>
          <p className="text-zinc-400 text-sm mt-2">Join the Reflex network</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Account Type (Role)</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="RETAILER">Retailer (Create Deliveries)</option>
              <option value="DISPATCHER">Dispatcher (Assign Riders)</option>
              <option value="RIDER">Rider (Deliver Packages)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-zinc-50 text-zinc-950 font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}