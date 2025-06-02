import { Play, Pause, RotateCcw } from "lucide-react";
const ControlPanel = (props: {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  totalCalls: number;
  callLength: number;
  resetSystem: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => props.setIsRunning(!props.isRunning)}
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${
              props.isRunning
                ? "bg-red-500 hover:bg-red-600 text-red-600"
                : "bg-green-500 hover:bg-green-600 text-green-600"
            }`}
          >
            {props.isRunning ? <Pause size={20} /> : <Play size={20} />}
            {props.isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={props.resetSystem}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-black rounded-lg font-semibold flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-600">Total Calls</div>
            <div className="text-2xl font-bold text-blue-600">
              {props.totalCalls}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-600">Active Calls</div>
            <div className="text-2xl font-bold text-green-600">
              {props.callLength}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ControlPanel;
