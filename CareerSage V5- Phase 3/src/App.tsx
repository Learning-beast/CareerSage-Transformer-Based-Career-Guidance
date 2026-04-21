import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { FormProvider } from "./context/FormContext";
import PersonalInfoForm from "./components/PersonalInfo";
import SkillsForm from "./components/Skills";
import InterestsForm from "./components/Interests";
import Review from "./components/Review";
import CareerRecommendations from "./components/CareerRecommendations";
import SkillGap from "./components/SkillGap";
import JobResults from "./components/JobResults";
import type { SkillGapResult, CareerRec } from "./services/gemini";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PublicRoute from "./components/PublicRoute";
import AdminDashboard from "./pages/AdminDashboard";

const steps = [
  "Personal",
  "Skills",
  "Interests",
  "Review",
  "Recommendations",
  "Skill Gap",
  "Jobs",
];

const AppContent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [careerRecs, setCareerRecs] = useState<any[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any>({});
  const [skillGapResults, setSkillGapResults] = useState<SkillGapResult[]>([]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button
        onClick={() => navigate("/")}
        className="mb-8 flex items-center text-white hover:text-indigo-200 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </button>

      {/* Step indicator */}
      <div className="flex justify-between items-center mb-8 bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                i <= step
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm font-medium ${i === step ? "text-white" : "text-gray-400"}`}
            >
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* === PHASE 1 – Personal Info === */}
      {step === 0 && (
        <PersonalInfoForm
          onNext={(profile: any) => {
            setUserProfile(profile);
            setStep(1);
          }}
        />
      )}

      {/* === PHASE 2 – Skills === */}
      {step === 1 && (
        <SkillsForm onPrev={() => setStep(0)} onNext={() => setStep(2)} />
      )}

      {/* === PHASE 3 – Interests === */}
      {step === 2 && (
        <InterestsForm onPrev={() => setStep(1)} onNext={() => setStep(3)} />
      )}

      {/* === PHASE 4 – Review === */}
      {step === 3 && (
        <Review onPrev={() => setStep(2)} onGenerate={() => setStep(4)} />
      )}

      {/* === PHASE 5 – Career Recommendations === */}
      {step === 4 && (
        <CareerRecommendations
          onBack={() => setStep(3)}
          onNext={(skills: string[], recs: CareerRec[]) => {
            setUserSkills(skills);
            setCareerRecs(recs);
            setStep(5);
          }}
        />
      )}

      {/* === PHASE 6 – Skill Gap === */}
      {step === 5 && (
        <SkillGap
          userSkills={userSkills}
          careerRecommendations={careerRecs}
          userProfile={userProfile}
          onBack={() => setStep(4)}
          onShowJobs={(results: SkillGapResult[], careerRecs: CareerRec[]) => {
            setSkillGapResults(results);
            setStep(6);
          }}
        />
      )}

      {/* === PHASE 7 – Job Results === */}
      {step === 6 && (
        <JobResults
          skillGapResults={skillGapResults}
          careerRecommendations={careerRecs}
          userProfile={userProfile}
          onBack={() => setStep(5)}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <FormProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected Routes */}

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/adminDashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/app"
              element={
                <div className="min-h-screen">
                  <AppContent />
                </div>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </FormProvider>
    </Router>
  );
};

export default App;
