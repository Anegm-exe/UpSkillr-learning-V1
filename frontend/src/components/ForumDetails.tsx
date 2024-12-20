import forumcss from '../styles/forumcss.module.css';

interface ForumDetailsProps {
  forumData: {
    course_id: string;
    user_id: string;
    title: string;
    messages: string[];
    timestamp: Date;
  };
  onBack: () => void;
}

export default function ForumDetails({ forumData, onBack }: ForumDetailsProps) {
  return (
    <div className={forumcss.moduleContainer}>
      <h1>Forum Details for Course ID: {forumData.course_id}</h1>
      <div className={forumcss.moduleDetails}>
        <h2 className={forumcss.moduleTitle}>
          Forum Title: {forumData.title}
        </h2>
        <p className={forumcss.moduleInfo}>User ID: {forumData.user_id}</p>
        <p className={forumcss.moduleInfo}>
          Timestamp: {new Date(forumData.timestamp).toLocaleString()}
        </p>
        <h3>Messages:</h3>
        <ul className={forumcss.messageList}>
          {forumData.messages.length > 0 ? (
            forumData.messages.map((message, index) => (
              <li key={index} className={forumcss.messageItem}>
                {message}
              </li>
            ))
          ) : (
            <p className={forumcss.noMessages}>No messages available</p>
          )}
        </ul>
      </div>
      <button onClick={onBack} className={forumcss.backButton}>
        Back to Forums
      </button>
    </div>
  );
}
