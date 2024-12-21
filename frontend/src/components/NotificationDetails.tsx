import DashboardCss from '../styles/dashboard.module.css';

interface NotificatrionDetailsProps {
    notificationData: {
        _id: string;
        message: string;
        sender_id: string;
        timestamp: string;
    };
}

export default function NotificationDetails({ notificationData }: NotificatrionDetailsProps) {

    // Parse the timestamp
    const timestamp = new Date(notificationData.timestamp);

    // Get today's date and format it for comparison
    const today = new Date();
    const isToday =
        timestamp.getDate() === today.getDate() &&
        timestamp.getMonth() === today.getMonth() &&
        timestamp.getFullYear() === today.getFullYear();

    // Get yesterday's date and format it for comparison
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
        timestamp.getDate() === yesterday.getDate() &&
        timestamp.getMonth() === yesterday.getMonth() &&
        timestamp.getFullYear() === yesterday.getFullYear();

    // Format the time
    const formattedTime = isToday
        ? `Today at ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : isYesterday
            ? `Yesterday at ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : `${timestamp.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })} at ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
        <div className={DashboardCss.notificationtemplate}>
            <h1>
                <span style={{ color: "var(--accent-color)" }}>
                    {notificationData.sender_id || "Server Notification"}
                </span>
                <span style={{ color: "dimgray" }}>{" " + ":" + " "}</span>
                <span>{formattedTime}</span>
            </h1>
            <p>{notificationData.message}</p>
            <div className={DashboardCss.separatorline} style={{ width: '10%' }}></div>  {/* Separator */}
        </div>
    );
}
