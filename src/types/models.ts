interface ElevatorCall {
  id: string;
  floor: number;
  direction: "up" | "down";
  timestamp: number;
}
interface Passenger {
  id: string;
  fromFloor: number;
  direction: "up" | "down" | "idle";
  toFloor: number;
}
interface Elevator {
  id: number;
  floor: number;
  direction: "up" | "down" | "idle";
  timestamp?: number;
  passengers: Passenger[];
  targetFloors: Set<number>;
  isMoving: boolean;
  isDoorOpen: boolean;
  lastMoveTime: number;
}
interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: "call" | "movement" | "pickup" | "dropoff" | "system";
}

export type { LogEntry, Elevator, ElevatorCall, Passenger };
