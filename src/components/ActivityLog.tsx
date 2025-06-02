import { type LogEntry } from "../types/models";

const ActivityLog = (props: { logs: LogEntry[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Activity Log</h2>
      <div className="h-64 overflow-y-auto space-y-2">
        {props.logs.map((log) => (
          <div
            key={log.id}
            className={`text-xs p-2 rounded ${
              log.type === "call"
                ? "bg-orange-100"
                : log.type === "movement"
                ? "bg-blue-100"
                : log.type === "pickup"
                ? "bg-green-100"
                : log.type === "dropoff"
                ? "bg-purple-100"
                : "bg-gray-100"
            }`}
          >
            <div className="font-medium">{log.message}</div>
            <div className="text-gray-500 text-xs">
              {new Date(log.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ActivityLog;
