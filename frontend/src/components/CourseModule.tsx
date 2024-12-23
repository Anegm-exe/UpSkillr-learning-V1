import { useState } from "react";
import { useModuleRate } from "../app/_hooks/useModuleRate";
import { useDownloadFile } from "@/app/_hooks/useDownloadFile";
import { useFetchContent } from "@/app/_hooks/useFetchContent";
export interface Content {
  _id: string;
  title: string;
  description: string;
  fileVersionId: string; // Assuming each content has a file version ID for downloads
  // Add other relevant fields as needed
}

export interface ModuleType {
  _id: string;
  course_id: string;
  title: string;
  difficulty: string;
  resources: string[];
  content_ids: string[];
  no_question: number;
  type: string;
  question_bank: string[];
  quizzes: string[];
  timestamp: string;
  __v: number;
  ratings: number[];
}

export interface CourseDetailsProps {
  _id: string;
  title: string;
  description: string;
  instructor: InstructorProps[];
  category: string[];
  modules: ModuleType[];
}

export interface InstructorProps {
  _id: string;
  name: string;
  profile_picture_url: string;
  dateOfBirth: string;
  role: string;
}

export interface CourseModuleProps {
  module: ModuleType;
}

const CourseModule: React.FC<CourseModuleProps> = ({ module }) => {
  const [rating, setRating] = useState<number>(0);
  const { rateModule, loading, error, success } = useModuleRate();

  const handleRate = () => {
    if (rating < 1 || rating > 5) {
      alert("Please enter a rating between 1 and 5.");
      return;
    }
    rateModule(module._id, rating);
  };

  const averageRating = module.ratings.length > 0 ? module.ratings.reduce((acc, val) => acc + val, 0) / module.ratings.length : "No ratings yet";
  return (
    <div>
      <h2>Title: {module.title}</h2>
      <p>ID: {module._id}</p>
      <p>Difficulty: {module.difficulty}</p>
      <div>
        {module.content_ids.map((contentId) => {
          return <div key={contentId}></div>;
        })}
      </div>
      <p>Type: {module.type}</p>
      <p>Average Ratings: {averageRating}</p>

      <div>
        <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} placeholder="Enter rating (1-5)" />
        <button onClick={handleRate} disabled={loading}>
          {loading ? "Submitting..." : "Submit Rating"}
        </button>
      </div>

      {error && <p>{error}</p>}
      {success && <p>Rating submitted successfully!</p>}
      <div>
        <h3>Contents:</h3>
        {module.content_ids.map((contentId) => (
          <ContentItem key={contentId} contentId={contentId} />
        ))}
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

  if (loading) return <p>Loading content...</p>;
  if (error) return <p>{error}</p>;
  if (!content) return null;

  return (
    <div>
      <h4>{content.title}</h4>
      <p>{content.description}</p>
      <button onClick={() => downloadFile(content.currentVersion, `${content.title}`)}>Download</button>
    </div>
  );
};

export default CourseModule;
