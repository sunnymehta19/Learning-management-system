import { useNavigate } from "react-router";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden select-none">
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,80,0,0.35),_transparent_50%)]"></div>

      <div className="relative z-10 max-w-5xl text-center px-6">

        {/* Small tagline */}
        <p className="text-orange-500 tracking-widest mb-6 text-sm md:text-base">
          LEARN. BUILD. GROW.
        </p>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight font-neu-machina">
          Master In-Demand Skills <br />
          And <span className="text-orange-500">Build Your Future</span> In Tech
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 mt-6 text-lg md:text-xl max-w-3xl mx-auto">
          Join thousands of learners gaining real-world knowledge through 
          structured courses designed to help you grow your career and 
          achieve your goals.
        </p>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-3 mt-8 text-sm md:text-base">
          <span className="text-orange-500 font-semibold">
            1,000+ Students
          </span>
          <span className="text-gray-400">
            already learning on our platform
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/courses")}
          className="mt-10 bg-orange-600 hover:bg-orange-700 transition px-8 py-4 rounded-xl text-lg font-semibold"
        >
          Explore Courses →
        </button>

      </div>
    </section>
  );
}

export default HeroSection;