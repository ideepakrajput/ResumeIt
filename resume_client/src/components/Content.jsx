import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BACKEND_URL } from "../constants";

export default function Content() {
  const [description, setDescription] = useState("");
  const [bulletCount, setBulletCount] = useState(3);
  const [bulletLength, setBulletLength] = useState("short");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      description,
      bulletCount,
      bulletLength,
    });
    setLoading(true);
    setResult("");
    // later you can send this to your backend
    try {
      const response = await fetch(`${BACKEND_URL}/get-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: description,
          bulletCount,
          bulletLength,
        }),
      });

      const data = (await response.json()).data;

      //   let formatted = data.replace(/\\n/g, "\n");
      //   formatted = formatted.replace(/([^\n])\n(\d+\.)/g, "$1\n\n$2");
      //   console.log("Formatted string:\n", formatted);
      setResult(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center w-full py-12 px-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-indigo-600">
          ✨ Get Content for Your Resume
        </h1>
        <p className="text-gray-600 mt-2">
          Describe your project or experience in detail, and we’ll generate
          professional resume bullet points for you.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project / Experience Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="It is a fullstack web application that..."
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none shadow-sm"
            />
          </div>

          {/* Bullet Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Bullet Points
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setBulletCount(num)}
                  className={`w-10 h-10 rounded-full font-medium shadow-sm transition ${
                    bulletCount === num
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Bullet Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bullet Point Length
            </label>
            <div className="flex gap-4">
              {["short", "medium"].map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setBulletLength(size)}
                  className={`px-5 py-2 rounded-lg font-medium shadow-sm transition ${
                    bulletLength === size
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-indigo-700 transition"
            >
              Generate Resume Content
            </button>
          </div>
        </form>
        {/* Result / Loading Box */}
        {(loading || result) && (
          <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm prose prose-lg max-w-none min-h-[120px] flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                {/* spinner */}
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">
                  Generating your resume content, please wait...
                </p>
              </div>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
