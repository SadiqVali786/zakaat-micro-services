import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="mt-4">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  );
}
