import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}

