import { ArrowUp, ArrowDown, Users } from "lucide-react";
import { getElevatorColor } from "../../utils/helpers";
import { type Elevator, type ElevatorCall } from "../types/models";
import { FLOORS } from "../constants";
const Elevators = (props: { elevators: Elevator[]; calls: ElevatorCall[] }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Building Overview
        </h2>
        <div className="grid grid-cols-12 gap-1">
          {/* Floor labels */}
          <div className="col-span-1">
            {Array.from({ length: FLOORS }, (_, i) => (
              <div
                key={i}
                className="h-12 flex items-center justify-center text-sm font-semibold text-gray-600"
              >
                {FLOORS - i}
              </div>
            ))}
          </div>

          {/* Elevators */}
          {props.elevators.map((elevator) => (
            <div key={elevator.id} className="col-span-2">
              {Array.from({ length: FLOORS }, (_, i) => {
                const floorNum = FLOORS - i;
                const isElevatorHere = elevator.floor === floorNum;
                const hasCall = props.calls.some(
                  (call) => call.floor === floorNum
                );

                return (
                  <div
                    key={i}
                    className={`h-12 border border-gray-300 flex items-center justify-center relative ${
                      isElevatorHere
                        ? getElevatorColor(elevator) + " text-white"
                        : hasCall
                        ? "bg-orange-100"
                        : "bg-gray-50"
                    }`}
                  >
                    {isElevatorHere && (
                      <div className="flex flex-col items-center">
                        <div className="text-xs font-bold">E{elevator.id}</div>
                        {elevator.passengers.length > 0 && (
                          <div className="flex items-center text-xs">
                            <Users size={10} />
                            <span className="ml-1">
                              {elevator.passengers.length}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {hasCall && !isElevatorHere && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {props.calls.find((call) => call.floor === floorNum)
                          ?.direction === "up" ? (
                          <ArrowUp size={16} className="text-green-600" />
                        ) : (
                          <ArrowDown size={16} className="text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Call indicators */}
          <div className="col-span-2">
            {Array.from({ length: FLOORS }, (_, i) => {
              const floorNum = FLOORS - i;
              const floorCalls = props.calls.filter(
                (call) => call.floor === floorNum
              );

              return (
                <div
                  key={i}
                  className="h-12 flex items-center justify-center text-xs"
                >
                  {floorCalls.map((call) => (
                    <div key={call.id} className="mx-1">
                      {call.direction === "up" ? (
                        <ArrowUp size={12} className="text-green-600" />
                      ) : (
                        <ArrowDown size={12} className="text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Elevators;
