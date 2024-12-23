import { useState } from "react";
import { useModuleRate } from "../app/_hooks/useModuleRate";
import { useDownloadFile } from "@/app/_hooks/useDownloadFile";
import { useFetchContent } from "@/app/_hooks/useFetchContent";
interface CourseModuleProps {
  module: ModuleType;
}

const CourseModule: React.FC<CourseModuleProps> = ({ module }) => {
  const [rating, setRating] = useState<number>(0);
  const { rateModule, loading: rateLoading, error: rateError, success: rateSuccess } = useModuleRate();

  return (
    <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 mb-4 shadow-lg">
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold text-white">{module.title}</h2>
        <p className="text-zinc-400">Difficulty: {module.difficulty}</p>
        <p className="text-zinc-400">Type: {module.type}</p>
        <p className="text-zinc-400">
          Average Rating:{" "}
          {module.ratings.length > 0 ? (module.ratings.reduce((a, b) => a + b, 0) / module.ratings.length).toFixed(2) : "No ratings yet"}
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          placeholder="Rate 1-5"
          className="bg-zinc-700 text-white rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button onClick={() => rateModule(module._id, rating)} disabled={rateLoading} className="  bg-zinc-300 p-2 rounded-md text-black">
          {rateLoading ? "Rating..." : "Rate Module"}
        </button>
      </div>

      {rateError && <p className="text-red-500 mb-4">{rateError}</p>}
      {rateSuccess && <p className="text-green-500 mb-4">Rating submitted successfully!</p>}

      <div className="mt-6">
        <h3 className="text-lg font-medium text-white mb-4">Contents</h3>
        <div className="space-y-4">
          {module.content_ids.map((contentId) => (
            <ContentItem key={contentId} contentId={contentId} />
          ))}
          {module.content_ids.length === 0 && <p>no content available</p>}
        </div>
      </div>
    </div>
  );
};

interface ContentItemProps {
  contentId: string;
}

const ContentItem: React.FC<ContentItemProps> = ({ contentId }) => {
  const { content, loading, error } = useFetchContent(contentId);
  const { downloadFile } = useDownloadFile();

  // Silently handle 404 errors by not rendering anything
  if (loading || error || !content) return null;
  console.log(content);
  return (
    <div className="bg-zinc-700/50 rounded-md p-4 border border-zinc-600">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-white font-medium">{content.title}</h4>
          <p className="text-zinc-400 text-sm">{content.description}</p>
        </div>
        <button
          onClick={() => downloadFile(content?.currentVersion, content.title)}
          className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};

export default CourseModule;
