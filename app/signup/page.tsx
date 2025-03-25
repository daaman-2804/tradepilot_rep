import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </main>
  )
}

