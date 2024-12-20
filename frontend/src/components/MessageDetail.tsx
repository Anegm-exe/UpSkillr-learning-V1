import messagecss from '../styles/messagecss.module.css';

interface MessageDetailsProps {
  messageData: {
    user_id: string;
    repliedTo_id?: string; // Optional field
    text: string;
    timestamp: Date;
  };
  onBack: () => void;
}

export default function MessageDetails({
  messageData,
  onBack,
}: MessageDetailsProps) {
  return (
    <div className={messagecss.moduleContainer}>
      <h1>Message Details</h1>
      <div className={messagecss.moduleDetails}>
        <p className={messagecss.moduleInfo}>User ID: {messageData.user_id}</p>
        {messageData.repliedTo_id ? (
          <p className={messagecss.moduleInfo}>
            Replied To Message ID: {messageData.repliedTo_id}
          </p>
        ) : (
          <p className={messagecss.moduleInfo}>No reply associated</p>
        )}
        <p className={messagecss.moduleInfo}>Message Text:</p>
        <div className={messagecss.messageText}>{messageData.text}</div>
        <p className={messagecss.moduleInfo}>
          Timestamp: {new Date(messageData.timestamp).toLocaleString()}
        </p>
      </div>
      <button onClick={onBack} className={messagecss.backButton}>
        Back to Messages
      </button>
    </div>
  );
}
