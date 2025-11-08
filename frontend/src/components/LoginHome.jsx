import { Link } from "react-router-dom";
import { useAuth } from '../App';
export default function Home() {
  const { user } = useAuth();
  
  return (
    <>
 <div className="bg-[#ddd6ca] flex items-center justify-center gap-6  p-6  h-180">
  <img
    src="/master_interview.png"
    alt="Prep Me Up Logo"
    className="w-132 h-auto flex-2"
  />

  <div className="flex-1 flex flex-col justify-center text-left">
    <div className="flex flex-wrap items-baseline gap-3">
      <p className="text-6xl font-extrabold text-red-600">Master</p>
      <p className="text-3xl font-bold text-gray-800">the Art of Interview</p>
    </div>
    <Link
          to="/practice"
          className="mt-6 inline-block bg-red-600 text-white text-xl font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300 w-85 h-20  flex items-center justify-center"
        >
          Get started !
        </Link>
  </div>
</div>
<div class="bg-[#efece6] p-4 md:p-8 lg:p-12 h-screen">
  <p className=" text-lg text-gray-700 max-w-xl leading-relaxed">
          <span className="font-semibold text-gray-900">Prep Me Up</span> is your
          personal AI-powered interview companion designed to help you practice,
          analyze, and improve your interview skills. Get instant feedback, track
          your progress, and gain the confidence to ace every technical and HR round.
        </p>
</div>
    
    </>
  );
}