import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Upload } from "lucide-react";
import { BACKEND_URL } from "../constants";

export default function Score() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length === 0) return;
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${BACKEND_URL}/rate-resume`, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()).data;
      let formatted = data.replace(/\\n/g, "\n");
      formatted = formatted.replace(/([^\n])\n(\d+\.)/g, "$1\n\n$2");
      setResult(formatted); // depends on how your backend responds
    } catch (error) {
      console.error("Upload error:", error);
      setResult({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Upload Your Resume for ATS Scoring
      </h1>

      {/* Upload Box */}
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-indigo-400 transition duration-200 bg-gray-50 hover:bg-indigo-50"
      >
        <Upload className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600">
          {file ? file.name : "Drag and drop your resume here"}
        </p>
        <p className="text-gray-400 text-sm mt-1">or click to browse</p>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`px-6 py-3 rounded-xl font-medium transition ${
            file && !loading
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Checking..." : "Check ATS Score"}
        </button>
      </div>

      {/* Result / Loading Box */}
      {(loading || result) && (
        <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm prose prose-lg max-w-none min-h-[120px] flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              {/* spinner */}
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">
                Analyzing your resume, please wait...
              </p>
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
          )}
        </div>
      )}
    </div>
  );
}
