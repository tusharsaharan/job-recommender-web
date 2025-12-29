import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-white/20">
        
        <p className="text-sm font-medium text-indigo-600 mb-2 text-center">
          AI-powered job matching
        </p>

        <h1 className="text-3xl font-bold text-center mb-2">
          JobMatch
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Discover jobs tailored to your skills
        </p>

        <button
          onClick={() => navigate("/onboarding")}
          className="
            w-full
            bg-indigo-600 text-white
            py-3 rounded-lg
            font-medium
            hover:bg-indigo-700
            hover:scale-[1.02]
            active:scale-95
            transition-transform
            duration-200
          "
        >
          Get Started →
        </button>

      </div>
    </div>
  );
}

export default Login;
