import { Link } from "react-router-dom";

export default function AllHome() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar */}
      <div className="bg-gray-800 text-white flex justify-center items-center py-3 shadow-md">
        <img src="/logo1.png" alt="Prep Me Up Logo" className="h-12 w-auto" />
      </div>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Ace Your Interviews with AI
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Practice with AI-powered interviews, get instant feedback, and land your dream job.
        </p>
        <Link
          to="/auth"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Get Started — It’s Free
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 px-10 mt-10">
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">🎤 AI-Powered Interviews</h3>
          <p>Get realistic interview questions tailored to your skills.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">📊 Detailed Feedback</h3>
          <p>Receive comprehensive reports highlighting strengths and weaknesses.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">🚀 Skill-Based Practice</h3>
          <p>Focus on improving specific skills relevant to your field.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="text-center mt-16 px-10 pb-16">
        <h2 className="text-3xl font-bold mb-6">Loved by Job Seekers Worldwide</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="italic text-gray-700">"This platform helped me land my dream job at Google!"</p>
            <p className="font-semibold mt-2">- Sarah, Software Engineer</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="italic text-gray-700">"The AI feedback was incredibly accurate and helpful."</p>
            <p className="font-semibold mt-2">- Mike, Data Scientist</p>
          </div>
        </div>
      </section>
    </div>
  );
}