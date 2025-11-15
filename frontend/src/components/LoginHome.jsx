import { Link } from "react-router-dom";
import { useAuth } from "../App";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12">
        <div className="relative isolate z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Background Blur Shape */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-10 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none"
          >
            <div
              className="relative left-1/2 aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-red-500 to-red-700 opacity-30 sm:w-[60rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          {/* Main Content Grid - Image takes 2/3, Text takes 1/3 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* IMAGE - Takes 2 columns */}
            <div className="lg:col-span-2 flex justify-center">
              <img
                src="/master_interview.png"
                alt="Interview Preparation"
                className="w-full max-w-3xl rounded-xl shadow-2xl transform hover:scale-105 transition duration-300"
              />
            </div>

            {/* TEXT CONTENT - Takes 1 column */}
            <div className="flex flex-col space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-red-600 leading-tight">
                  Master
                </h1>
                <p className="text-2xl lg:text-3xl font-bold text-gray-300">
                  the Art of Interview
                </p>
              </div>
              
              <Link
                to="/skill"
                className="mt-4 inline-block bg-red-600 text-white text-xl font-semibold py-4 px-8 rounded-lg hover:bg-red-700 transition duration-300 w-60 text-center"
              >
                Get started !
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}