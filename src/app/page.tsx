'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to LaunchGuide</h1>
      <p className="text-lg mb-8">
        Structured marketing guidance for early-stage technical founders.
      </p>
      <Link href="/onboarding">
        <button className="bg-primary text-primary-foreground hover:bg-primary/80 font-medium rounded-md px-4 py-2">
          Get Started
        </button>
      </Link>
    </div>
  );
}
