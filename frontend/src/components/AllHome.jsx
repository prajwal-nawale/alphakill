import { Link } from "react-router-dom";

export default function AllHome() {
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">

        {/* ------------------ TOPBAR ------------------ */}
        <header className="w-full bg-gray-900 py-4 shadow relative z-30">
          <div className="grid grid-cols-3 items-center px-6">

            {/* Left (empty to balance right) */}
            <div></div>

            {/* Center (Logo + Name) */}
            <div className="flex justify-center items-center gap-3 relative z-30">
              <img
                src="/logo.png"
                alt="Prep Me Up Logo"
                className="h-20 w-auto pointer-events-none select-none"
              />
              <h1 className="text-3xl font-semibold">Prep Me Up</h1>
            </div>

            {/* Right (Sign In Button) */}
            <div className="flex justify-end relative z-30">
              <Link
                to="/auth"
                className="rounded-md bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-400"
              >
                Sign In
              </Link>
            </div>

          </div>
        </header>


        {/* ------------------ HERO SECTION ------------------ */}
        <div className="relative isolate z-0 px-6 lg:px-8 flex-1">

          {/* Background Blur Shape */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 pointer-events-none transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              className="relative left-1/2 aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-pink-400 to-indigo-500 opacity-30 sm:w-[72rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>

          {/* Background Shape 2 */}
          <div className="absolute inset-y-0 right-1/2 -z-10 pointer-events-none mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 shadow-xl ring-1 shadow-indigo-500/5 ring-white/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

          {/* HERO CONTENT */}
          <div className="mx-auto max-w-2xl py-10 sm:py-24 text-center">
            <h1 className="text-5xl font-semibold text-white sm:text-7xl">
              Prep me up boosts confidence!
            </h1>

            <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl">
              Personal AI-powered interview companion designed to help you practice,
              analyze, and improve your interview skills. Get instant feedback, track
              your progress, and gain the confidence to ace every technical and HR round.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/auth"
                className="rounded-md bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-400"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>

      </div>


      {/* ------------------ HOW IT WORKS SECTION ------------------ */}
      <div className="bg-gray-900 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-6xl font-bold text-white mb-16">
            How It Works
          </h2>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">

            {/* Stat 1 */}
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base text-gray-400">
                Upload your resume (PDF) to extract the most relevant skills.
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Upload
              </dd>
            </div>

            {/* Stat 2 */}
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base text-gray-400">
                AI generates personalized interview questions and evaluates your responses.
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Interview
              </dd>
            </div>

            {/* Stat 3 */}
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base text-gray-400">
                Receive a detailed performance report based on your skills and answers.
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Report
              </dd>
            </div>

          </dl>
        </div>
      </div>


      {/* ------------------ TESTIMONIAL SECTION ------------------ */}
      <section className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-500),transparent)] opacity-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-1/2 -z-10 pointer-events-none mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 shadow-xl ring-1 shadow-indigo-500/5 ring-white/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

        <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
          <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold text-white sm:text-2xl">
              <p>
                “Prep Me Up transforms your interview preparation experience.
                From generating personalized questions to delivering deep performance
                insights, it gives you the confidence to excel in every round.”
              </p>
            </blockquote>

            <figcaption className="mt-6 text-base text-gray-300">
              <div className="font-semibold text-white text-lg">
                A trusted companion for interview success
              </div>
            </figcaption>
          </figure>
        </div>
      </section>


      {/* ------------------ FOOTER ------------------ */}
      <footer className="bg-gray-900 border-t border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Brand */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">Prep Me Up</h2>
            <p className="mt-2 text-gray-400 text-sm">
              Your AI-powered interview preparation companion.
            </p>
          </div>

          {/* Links */}
          <div className="mt-8 flex justify-center gap-8 text-gray-300 text-sm">
            <a href="#" className="hover:text-white transition">Home</a>
            
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6"></div>

          {/* Copyright */}
          <p className="text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} Prep Me Up. All rights reserved.
          </p>

        </div>
      </footer>
    </>
  );
}