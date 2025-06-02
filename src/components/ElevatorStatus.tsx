import { type Elevator } from "../types/models";
import { getElevatorColor, getElevatorStatus } from "../../utils/helpers";

const ElevatorStatus = (props: { elevators: Elevator[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Elevator Status</h2>
      <div className="space-y-3">
        {props.elevators.map((elevator) => (
          <div key={elevator.id} className="border rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Elevator {elevator.id}</span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  getElevatorColor(elevator) + " text-white"
                }`}
              >
                {getElevatorStatus(elevator)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div>Floor: {elevator.floor}</div>
              <div>Passengers: {elevator.passengers.length}</div>
              <div>
                Targets:{" "}
                {Array.from(elevator.targetFloors).join(", ") || "None"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ElevatorStatus;
