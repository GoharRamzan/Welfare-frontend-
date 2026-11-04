
import { useState } from 'react'
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sprout,
  UsersRound,
  HandHeart,
  LogIn,
} from 'lucide-react'

import logo from '../assets/fswf-logo.png'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'

const features = [
  {
    icon: HeartHandshake,
    title: 'Support Communities',
    description: 'Help those in need.',
  },
  {
    icon: UsersRound,
    title: 'Make an Impact',
    description: 'Every contribution matters.',
  },
  {
    icon: Sprout,
    title: 'Build a Better Future',
    description: 'Together, we can do more.',
  },
]

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim() || !password) {
      toast.error('Please enter email and password')
      return
    }

    try {
      setLoading(true)

      const result = await api.login({
        email: email.trim(),
        password,
      })

      if (result.success) {
        toast.success('Login successful! Welcome back.')

        setTimeout(() => {
          navigate('/dashboard')
        }, 700)
      } else {
        toast.error(result.message || 'Login failed')
      }
    } catch (error) {
      toast.error(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh bg-[#f3f6fa] sm:p-3 lg:flex lg:h-dvh lg:items-center lg:justify-center lg:overflow-hidden lg:p-4">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1600px] grid-cols-1 overflow-hidden bg-white shadow-sm sm:rounded-2xl sm:shadow-[0_20px_70px_rgba(15,42,72,0.10)] lg:h-full lg:min-h-0 lg:grid-cols-2">

        {/* BRAND PANEL: desktop and tablet */}
        <section className="relative hidden min-h-0 flex-col overflow-hidden bg-gradient-to-br from-[#061b31] via-[#0b355c] to-[#14569a] px-8 py-8 text-white sm:flex sm:px-9 md:px-10 lg:px-9 xl:px-12 xl:py-10">

          <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-300/10 blur-3xl" />

          <div className="relative flex shrink-0 items-center gap-3">
            <img
              src={logo}
              alt="Fikr-e-Sadaat Welfare Foundation"
              className="h-14 w-[72px] rounded-lg bg-white p-1 object-contain sm:h-16 sm:w-[82px]"
            />

            <div>
              <p className="text-xs font-bold tracking-wide sm:text-sm">
                FIKR-E-SADAAT
              </p>
              <p className="text-[10px] tracking-[0.12em] text-blue-200 sm:text-xs">
                WELFARE FOUNDATION
              </p>
            </div>
          </div>

          <div className="relative my-auto py-6">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-sky-300 sm:text-xs">
              ADMINISTRATION PORTAL
            </p>

            <h1 className="max-w-lg text-3xl font-bold leading-tight tracking-tight md:text-4xl xl:text-5xl">
              Together We Build
              <span className="mt-1 block text-sky-300">
                A Better Tomorrow.
              </span>
            </h1>

            <p className="mt-4 max-w-md text-xs leading-6 text-blue-100/85 md:text-sm">
              Providing hope, support and opportunities to those in need.
              Manage welfare activities with transparency and care.
            </p>

            <div className="mt-6 space-y-4">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 md:h-11 md:w-11">
                    <Icon size={20} strokeWidth={1.7} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold md:text-sm">
                      {title}
                    </p>
                    <p className="mt-1 text-[10px] text-blue-200 md:text-xs">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative shrink-0 border-t border-white/15 pt-4">
            <div className="flex items-center gap-3 text-xs text-blue-100">
              <HandHeart size={20} />
              <p>Small hands, meaningful change.</p>
            </div>
          </div>
        </section>

        {/* MOBILE BRANDING */}
        <div className="relative flex items-center gap-3 overflow-hidden bg-gradient-to-r from-[#061b31] to-[#14569a] px-5 py-4 text-white sm:hidden">
          <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-sky-300/10 blur-2xl" />

          <img
            src={logo}
            alt="Fikr-e-Sadaat Welfare Foundation"
            className="relative h-12 w-14 shrink-0 rounded-lg bg-white p-1 object-contain"
          />

          <div className="relative min-w-0">
            <p className="text-xs font-bold tracking-wide">
              FIKR-E-SADAAT
            </p>
            <p className="mt-0.5 text-[10px] tracking-[0.12em] text-blue-200">
              WELFARE FOUNDATION
            </p>
            <p className="mt-1 text-[10px] text-blue-100">
              Administration Portal
            </p>
          </div>
        </div>

        {/* LOGIN PANEL */}
        <section className="flex min-h-0 flex-col bg-white px-5 py-6 sm:px-7 sm:py-5 md:px-10 lg:px-8 lg:py-5 xl:px-14">

          <div className="flex shrink-0 items-center justify-end gap-2 text-[10px] text-slate-500 sm:text-xs">
            <ShieldCheck size={15} className="text-[#14569a]" />
            <span>Authorized personnel only</span>
          </div>

          <div className="mx-auto my-auto w-full max-w-[420px] py-5 sm:py-3">

            <div className="mb-4 flex justify-center sm:mb-3">
              <img
                src={logo}
                alt="FSWF logo"
                className="h-[76px] w-28 object-contain sm:h-[82px] sm:w-32 lg:h-[72px] lg:w-28 xl:h-[88px] xl:w-36"
              />
            </div>

            <div className="mb-6 sm:mb-5">
              <h2 className="text-2xl font-bold tracking-tight text-[#0b2947] sm:text-3xl">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access your welfare dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-3.5">

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="flex h-12 min-w-0 items-center gap-3 rounded-lg border border-slate-200 px-3.5 transition focus-within:border-[#2468a8] focus-within:ring-4 focus-within:ring-blue-100 sm:px-4">
                  <Mail size={18} className="shrink-0 text-[#315a80]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="flex h-12 min-w-0 items-center gap-3 rounded-lg border border-slate-200 px-3.5 transition focus-within:border-[#2468a8] focus-within:ring-4 focus-within:ring-blue-100 sm:px-4">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-[#315a80]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="shrink-0 text-slate-400 transition hover:text-[#14569a]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 py-1 text-xs sm:text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 accent-[#14569a]"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="font-medium text-[#14569a] hover:text-[#0b2947]"
                  onClick={() => {
                    window.alert('Please contact your system administrator.')
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0b3157] to-[#246db3] text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-400 sm:mt-4 sm:pt-3 sm:text-xs">
              <ShieldCheck size={15} className="shrink-0 text-[#2468a8]" />
              <span>Secure access for authorized staff</span>
            </div>
          </div>

          <p className="shrink-0 text-center text-[10px] leading-5 text-slate-400 sm:text-xs">
            © {new Date().getFullYear()} Fikr-e-Sadaat Welfare Foundation
          </p>
        </section>
      </div>
    </main>
  )
}
