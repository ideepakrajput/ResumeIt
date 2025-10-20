import { useNav } from "./context";
import Navbar from "./components/Navbar";
import Score from "./components/Score";
import Content from "./components/Content";
import { BarChart3, FileText } from "lucide-react";

const App = () => {
  const { selectedPage, setSelectedPage } = useNav();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {selectedPage === "" ? (
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Card 1 */}
            <div
              onClick={() => setSelectedPage("content")}
              className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm cursor-pointer transition hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                Get Resume Content
              </h2>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Generate professional bullet points for your projects.
              </p>
            </div>
            {/* Card 2 */}
            <div
              onClick={() => setSelectedPage("score")}
              className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm cursor-pointer transition hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                Check Your Resume Score
              </h2>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Upload your resume and instantly analyze ATS compatibility.
              </p>
            </div>
          </div>
        </main>
      ) : selectedPage === "score" ? (
        <Score />
      ) : (
        <Content />
      )}
    </div>
  );
};

export default App;
