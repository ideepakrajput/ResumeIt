import { useNav } from "../context";

export default function Navbar() {
  const { selectedPage, setSelectedPage } = useNav();

  const linkClasses = (page) =>
    `px-4 py-2 rounded-full font-medium transition ${
      selectedPage === page
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
    }`;

  return (
    <nav className="w-full">
      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between md:justify-start px-8 py-4 bg-white md:shadow shadow">
        <h1
          className="text-2xl font-bold text-indigo-600 cursor-pointer mx-auto md:mx-0"
          onClick={() => setSelectedPage("")}
        >
          ResumeIt
        </h1>

        {/* Links (hidden on small screens) */}
        <div className="hidden md:flex space-x-4 ml-auto">
          <button
            onClick={() => setSelectedPage("content")}
            className={linkClasses("content")}
          >
            Build Resume
          </button>
          <button
            onClick={() => setSelectedPage("score")}
            className={linkClasses("score")}
          >
            ATS Score
          </button>
        </div>
      </div>

      {/* Bottom bar (only visible on small screens) */}
      <div className="relative z-10 flex md:hidden justify-center space-x-3 px-4 py-3 bg-white shadow-sm">
        <button
          onClick={() => setSelectedPage("content")}
          className={linkClasses("content")}
        >
          Build Resume
        </button>
        <button
          onClick={() => setSelectedPage("score")}
          className={linkClasses("score")}
        >
          ATS Score
        </button>
      </div>
    </nav>
  );
}
