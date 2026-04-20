// components/HomeUI.tsx
"use client"

import Image from "next/image"
import AuthButton from "./AuthButton"

export default function HomeUI({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
    return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div className="space-y-1">
            <Image
              src="/infracore_logo.svg"
              alt="InfraCore"
              width={160}
              height={32}
              priority
            />
            <p className="text-xs text-slate-400">Technical Support Company</p>
          </div>
          <div className="flex items-center gap-3">
            <AuthButton isAuthenticated={isAuthenticated} size="sm" />
            <a
              href="#schedule-call"
              className="rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-600/10 hover:text-blue-200"
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              AI-Powered Solutions & Modern App Development
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
              InfraCore builds intelligent software that scales. From AI-driven platforms to
              high-performance web and mobile applications, we help businesses innovate,
              automate, and deliver exceptional digital experiences.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <AuthButton isAuthenticated={isAuthenticated} size="md" />
              <a
                href="#schedule-call"
                className="rounded-md border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-600/10 hover:text-blue-200"
              >
                Schedule a Call
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-black/30">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
              Why InfraCore
            </p>
            <ul className="mt-6 space-y-4 text-sm text-slate-300">
              <li className="rounded-md border border-slate-800 bg-slate-950/70 p-4">
                AI-first development approach to automate workflows and unlock data insights.
              </li>
              <li className="rounded-md border border-slate-800 bg-slate-950/70 p-4">
                Full-stack expertise across web, iOS, and Android platforms.
              </li>
              <li className="rounded-md border border-slate-800 bg-slate-950/70 p-4">
                Scalable, secure, and performance-driven architecture for modern businesses.
              </li>
            </ul>
          </div>
        </section>

        <section id="services" className="border-y border-slate-800/70 bg-slate-900/40">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Core Development & AI Services
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
                <h3 className="font-semibold text-white">AI Product Development</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Custom AI solutions including automation tools, chat systems, and intelligent
                  data processing tailored to your business needs.
                </p>
              </article>

              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
                <h3 className="font-semibold text-white">Web Application Development</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Modern, scalable web apps built with cutting-edge technologies focused on
                  performance, UX, and reliability.
                </p>
              </article>

              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
                <h3 className="font-semibold text-white">Mobile App Development</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  High-quality iOS and Android apps designed for seamless user experiences and
                  optimized performance across devices.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="schedule-call" className="mx-auto w-full max-w-6xl px-6 py-14">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Start Building Your Next Digital Product
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Let’s discuss your idea, technical requirements, and growth strategy. Our team
                will help you design, build, and scale AI-powered applications that deliver
                real business impact.
              </p>
            </div>
            <a
              href="mailto:sales@infracore.com?subject=Project%20Consultation"
              className="mt-6 inline-flex rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 md:mt-0"
            >
              Schedule a Call
            </a>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-slate-400">
        Need immediate assistance? Email support@infracore.com or sign in to the client portal.
      </footer>
    </div>
  );
}