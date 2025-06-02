import { type Elevator } from "../src/types/models";

const getElevatorStatus = (elevator: Elevator) => {
  if (elevator.isDoorOpen) return "Doors Open";
  if (elevator.isMoving) return "Moving";
  return elevator.direction === "idle" ? "Idle" : `Going ${elevator.direction}`;
};
const getElevatorColor = (elevator: Elevator) => {
  if (elevator.isDoorOpen) return "bg-yellow-500";
  if (elevator.isMoving) return "bg-blue-500";
  if (elevator.direction === "up") return "bg-green-500";
  if (elevator.direction === "down") return "bg-red-500";
  return "bg-gray-500";
};

export { getElevatorColor, getElevatorStatus };
