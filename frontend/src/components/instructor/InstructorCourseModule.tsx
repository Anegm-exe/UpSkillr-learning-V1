import { useEffect, useState } from "react";
import { useModuleRate } from "@/app/_hooks/useModuleRate";
import { useDownloadFile } from "@/app/_hooks/useDownloadFile";
import { useFetchContent } from "@/app/_hooks/useFetchContent";
import { useInstructorModuleFunctions } from "@/app/_hooks/useInstructorModuleFunctions";
import QuestionsList from "./QuestionsList";
import AddQuestionForm from "./AddQuestionForm";
import ModuleDetails from "../ModuleDetails";
import ModuleDetailsInstructor from "./ModuleDetailsInstructor";
import axios from "@/app/api/axios";
interface CourseModuleProps {
  module: ModuleType;
}
interface ContentItemProps {
  contentId: string;
  handleDeleteContent: (courseId: string, moduleId: string) => Promise<void>;
  handleUpdateContent: (contentId: string, updateContentDto: UpdateContentDto, file: File) => Promise<void>;
  moduleId: string;
}

interface ContentListProps {
  contentIds: string[];
  handleDeleteContent: (courseId: string, moduleId: string) => Promise<void>;
  handleUpdateContent: (contentId: string, updateContentDto: UpdateContentDto, file: File) => Promise<void>;
  moduleId: string;
}
interface UpdateModuleFormProps {
  moduleTitle: string;
  setModuleTitle: (title: string) => void;
  handleUpdateModule: () => Promise<void>;
}

export interface Questions {
  _id?: string;
  title: string;
  type: string;
  options: string[];
  answer: number;
  difficulty: string;
}

export interface CreateContentDto {
  readonly title: string;
  readonly file?: File;
  readonly desc: string;
}
export interface UpdateContentDto {
  readonly title?: string;
  readonly url?: string;
  readonly desc?: string;
  readonly currentVersion?: number;
  readonly fileType: string;
}

export interface CreateModuleDto {
  course_id?: string;
  title: string;
  difficulty: string;
  no_question: number;
  type: string;
  resources?: string[];
  content_ids?: string[];
}

export interface UpdateModuleDto {
  title?: string;
  difficulty?: string;
  no_question?: number;
  type?: string;
  resources?: string[];
  content_ids?: string[];
}

const InstructorCourseModule: React.FC<CourseModuleProps> = ({ module }) => {
  const [rating, setRating] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("mcq");
  const [questionOptions, setQuestionOptions] = useState<string[]>([""]);
  const [questionAnswer, setQuestionAnswer] = useState<number>(0);
  const [questionDifficulty, setQuestionDifficulty] = useState<string>("easy");
  const [moduleTitle, setModuleTitle] = useState<string>(module.title);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(true);
  const [errorQuestions, setErrorQuestions] = useState<string | null>(null);
  const [file, setFile] = useState<File>();
  const [contentTitle, setContentTitle] = useState<string>("");
  const [contentDescription, setContentDescription] = useState<string>("");

  const { updateModule, updateQuestion, addQuestion, deleteQuestion, deleteModule, getQuestion, uploadContent, updateContent, deleteContent } =
    useInstructorModuleFunctions();
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await Promise.all(
          module.question_bank.map(async (questionId) => {
            try {
              return await getQuestion(questionId);
            } catch (error: any) {
              if (error.response && error.response.status === 404) {
                console.warn(`Question with ID ${questionId} not found, skipping.`);
                return null; // Ignore 404 errors
              } else {
                throw error; // Re-throw other errors
              }
            }
          })
        );

        setQuestions(fetchedQuestions.filter((question) => question !== null));
      } catch (error: any) {
        if (error.response && error.response.status !== 404) {
          setErrorQuestions(error.message);
        }
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [module.question_bank]);

  const handleUpdateModule = async () => {
    try {
      await updateModule(module._id, { title: moduleTitle });
      alert("Module updated successfully!");
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  const handleUpdateQuestion = async (questionId: string, updateQuestionDto: UpdateQuestionDto) => {
    try {
      await updateQuestion(questionId, updateQuestionDto);
      alert("Question updated successfully!");
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      await addQuestion(module._id, [
        { title: question, options: questionOptions, answer: questionAnswer, difficulty: questionDifficulty, type: questionType },
      ]);
      setQuestion("");
      setQuestionOptions([""]);
      setQuestionAnswer(0);
      setQuestionDifficulty("easy");
      setQuestionType("mcq");
      alert("Question added successfully!");
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(module._id, questionId);
      setQuestions(questions.filter((q) => q._id !== questionId));
      alert("Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleDeleteModule = async () => {
    if (confirm("Are you sure you want to delete this module?")) {
      try {
        await deleteModule(module._id);
        alert("Module deleted successfully!");
      } catch (error) {
        console.error("Error deleting module:", error);
      }
    }
  };

  const handleUploadContent = async (moduleId: string, createContentDto: CreateContentDto, file: File) => {
    try {
      await uploadContent(moduleId, createContentDto, file);
      alert("Content uploaded successfully!");
    } catch (error) {
      console.error("Error uploading content:", error);
    }
  };

  const handleUpdateContent = async (contentId: string, updateContentDto: UpdateContentDto, file: File) => {
    try {
      await updateContent(contentId, updateContentDto, file);
      alert("Content updated successfully!");
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleDeleteContent = async (contentId: string, moduleId: string) => {
    try {
      await deleteContent(contentId, moduleId);
      alert("Content deleted successfully!");
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };
  const initializeQuizzes = (course_id:string,module_id:string) => {
    try{
      axios.post(`course/${course_id}/module/${module_id}/quizzes`);
    }catch (error){
      //@ts-expect-error
      console.error(error.response.data.message);
    }
  }

  return (
    <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 mb-4 shadow-lg">
      <ModuleDetailsInstructor module={module} rating={rating} />
      <button onClick={() => initializeQuizzes(module.course_id,module._id)}className="  bg-zinc-300 p-2 rounded-md text-black">
          Initialize quizzes
        </button>
      <QuestionsList
        questions={questions}
        loadingQuestions={loadingQuestions}
        errorQuestions={errorQuestions}
        handleDeleteQuestion={handleDeleteQuestion}
        handleUpdateQuestion={handleUpdateQuestion}
      />
      <AddQuestionForm
        question={question}
        setQuestion={setQuestion}
        questionType={questionType}
        setQuestionType={setQuestionType}
        questionOptions={questionOptions}
        setQuestionOptions={setQuestionOptions}
        questionAnswer={questionAnswer}
        setQuestionAnswer={setQuestionAnswer}
        questionDifficulty={questionDifficulty}
        setQuestionDifficulty={setQuestionDifficulty}
        handleAddQuestion={handleAddQuestion}
      />
      <UpdateModuleForm moduleTitle={moduleTitle} setModuleTitle={setModuleTitle} handleUpdateModule={handleUpdateModule} />
      <div className="mt-6">
        <button onClick={handleDeleteModule} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition-colors">
          Delete Module
        </button>
      </div>
      <ContentList
        moduleId={module._id}
        contentIds={module.content_ids}
        handleUpdateContent={handleUpdateContent}
        handleDeleteContent={handleDeleteContent}
      />

      <div className="mt-6">
        <h3 className="text-lg font-medium text-white mb-4">Upload Content</h3>
        <input
          type="file"
          className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Content Title"
          className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
          onChange={(e) => setContentTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Content Description"
          className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
          onChange={(e) => setContentDescription(e.target.value)}
        />
        <button
          onClick={() => handleUploadContent(module._id, { title: contentTitle, description: contentDescription, fileType: "pdf" }, file)}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition-colors"
        >
          Upload Content
        </button>
      </div>
    </div>
  );
};

const UpdateModuleForm: React.FC<UpdateModuleFormProps> = ({ moduleTitle, setModuleTitle, handleUpdateModule }) => {
  return (
    <div className="mt-6">
      <label htmlFor="moduleTitle" className="block text-white mb-2">
        Module Title
      </label>
      <input
        id="moduleTitle"
        type="text"
        value={moduleTitle}
        onChange={(e) => setModuleTitle(e.target.value)}
        placeholder="Module Title"
        className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
      />
      <button onClick={handleUpdateModule} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors">
        Update Module
      </button>
    </div>
  );
};

const ContentList: React.FC<ContentListProps> = ({ contentIds, handleDeleteContent, moduleId, handleUploadContent, handleUpdateContent }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-white mb-4">Contents</h3>
      <div className="space-y-4">
        {contentIds.map((contentId) => (
          <InstructorContentItem
            key={contentId}
            handleUpdateContent={handleUpdateContent}
            contentId={contentId}
            moduleId={moduleId}
            handleDeleteContent={handleDeleteContent}
          />
        ))}
        {contentIds.length === 0 && <p className="text-zinc-400">No content available</p>}
      </div>
    </div>
  );
};

const InstructorContentItem: React.FC<ContentItemProps> = ({ contentId, handleDeleteContent, handleUpdateContent, moduleId }) => {
  const { content, loading, error } = useFetchContent(contentId);
  const { downloadFile } = useDownloadFile();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);

  useEffect(() => {
    if (content) {
      setEditTitle(content.title || "");
      setEditDescription(content.description || "");
    }
  }, [content]);

  const handleSave = async () => {
    // Ensure file is selected or handle accordingly
    if (!editFile && !editDescription && !editTitle) {
      alert("Please provide at least one field to update");
      return;
    }
    await handleUpdateContent(
      contentId,
      {
        title: editTitle,
        desc: editDescription,
        fileType: "pdf", // fallback to existing fileType
      },
      editFile!
    );
    setIsEditing(false);
  };

  if (loading || error || !content) return null;

  return (
    <div className="bg-zinc-700/50 rounded-md p-4 border border-zinc-600">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Content Title"
            className="bg-zinc-600 text-white rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Content Description"
            className="bg-zinc-600 text-white rounded-md px-3 py-2 w-full"
          />
          <input
            type="file"
            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
            className="bg-zinc-600 text-white rounded-md px-3 py-2 w-full"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-white font-medium">{content.title}</h4>
            <p className="text-zinc-400 text-sm">{content.description}</p>
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => downloadFile(content.currentVersion, content.title)}
              className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              {/* Download Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
              Edit
            </button>
            <button onClick={() => handleDeleteContent(contentId, moduleId)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourseModule;
