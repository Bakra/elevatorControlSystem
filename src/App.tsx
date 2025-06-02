import { useState, useEffect, useCallback } from "react";
import {
  type Elevator,
  type ElevatorCall,
  type LogEntry,
  type Passenger,
} from "./types/models";
import ActivityLog from "./components/ActivityLog";
import ElevatorStatus from "./components/ElevatorStatus";
import ControlPanel from "./components/ControlPanel";
import { DOOR_TIME, ELEVATORS_COUNT, FLOORS, MOVE_TIME } from "./constants";
import Elevators from "./components/Elevators";

export default function ElevatorControlSystem() {
  const [elevators, setElevators] = useState<Elevator[]>(() =>
    Array.from({ length: ELEVATORS_COUNT }, (_, i) => ({
      id: i + 1,
      floor: 1,
      direction: "idle" as const,
      passengers: [],
      targetFloors: new Set<number>(),
      isMoving: false,
      isDoorOpen: false,
      lastMoveTime: 0,
    }))
  );

  const [calls, setCalls] = useState<ElevatorCall[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalCalls: 0,
    totalTrips: 0,
    avgWaitTime: 0,
  });

  const addLog = useCallback(
    (message: string, type: LogEntry["type"] = "system") => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        message,
        type,
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 50)); // keep last 50 logs
    },
    []
  );

  const generateRandomCall = useCallback(() => {
    const floor = Math.floor(Math.random() * FLOORS) + 1;
    const direction =
      floor === FLOORS
        ? "down"
        : floor === 1
        ? "up"
        : Math.random() > 0.5
        ? "up"
        : "down";

    const call: ElevatorCall = {
      id: Math.random().toString(36).substring(2, 9),
      floor,
      direction,
      timestamp: Date.now(),
    };
    setCalls((prev) => [...prev, call]);
    setStats((prev) => ({ ...prev, totalCalls: prev.totalCalls + 1 }));
    addLog(`New ${direction} call on floor ${floor}`, "call");
  }, [addLog]);

  const findBestElevator = useCallback(
    (call: ElevatorCall): number => {
      let bestElevator = 0;
      let bestScore = Infinity;

      elevators.forEach((elevator, index) => {
        let score = 0;
        const distance = Math.abs(elevator.floor - call.floor);

        score += distance * 10; // base score
        score += elevator.passengers.length * 5; // penalty for busy elevators
        score += elevator.targetFloors.size * 3;
        if (elevator.direction === call.direction) {
          if (
            (call.direction === "up" && elevator.floor <= call.floor) ||
            (call.direction === "down" && elevator.floor >= call.floor)
          ) {
            score -= 20; // bonus for same direction and correct position
          }
        }

        if (elevator.direction === "idle") score -= 15; // bonus for idle elevator
        if (score < bestScore) {
          bestScore = score;
          bestElevator = index;
        }
      });
      return bestElevator;
    },
    [elevators]
  );

  const assignCallToElevator = useCallback(
    (call: ElevatorCall) => {
      const elevatorIndex = findBestElevator(call);

      setElevators((prev) => {
        const newElevators = [...prev];
        const elevator = { ...newElevators[elevatorIndex] };

        elevator.targetFloors.add(call.floor);

        if (elevator.direction === "idle") {
          elevator.direction =
            elevator.floor < call.floor
              ? "up"
              : elevator.floor > call.floor
              ? "down"
              : "idle";
        }

        newElevators[elevatorIndex] = elevator;
        return newElevators;
      });

      setCalls((prev) => prev.filter((c) => c.id !== call.id));
      addLog(
        `Elevator ${elevators[elevatorIndex].id} assigned to floor ${call.floor}`,
        "system"
      );
    },
    [elevators, findBestElevator, addLog]
  );
  const moveElevator = useCallback(
    (elevatorIndex: number) => {
      setElevators((prev) => {
        const newElevators = [...prev];
        const elevator = { ...newElevators[elevatorIndex] };

        if (elevator.isMoving || elevator.isDoorOpen) return prev;

        const now = Date.now();
        if (
          now - elevator.lastMoveTime < MOVE_TIME &&
          elevator.lastMoveTime > 0
        ) {
          return prev;
        }

        // Check if we need to stop at current floor
        const shouldStop =
          elevator.targetFloors.has(elevator.floor) ||
          elevator.passengers.some((p) => p.toFloor === elevator.floor);

        if (shouldStop) {
          elevator.isDoorOpen = true;
          elevator.targetFloors.delete(elevator.floor);

          // Drop off passengers
          const droppingOff = elevator.passengers.filter(
            (p) => p.toFloor === elevator.floor
          );
          elevator.passengers = elevator.passengers.filter(
            (p) => p.toFloor !== elevator.floor
          );

          if (droppingOff.length > 0) {
            addLog(
              `Elevator ${elevator.id} dropped off ${droppingOff.length} passenger(s) at floor ${elevator.floor}`,
              "dropoff"
            );
          }

          // Pick up new passengers (simplified - assume passengers board)
          const newPassenger: Passenger = {
            id: Math.random().toString(36).substring(2, 9),
            fromFloor: elevator.floor,
            toFloor:
              elevator.direction === "up"
                ? Math.floor(Math.random() * (FLOORS - elevator.floor)) +
                  elevator.floor +
                  1
                : Math.floor(Math.random() * (elevator.floor - 1)) + 1,
            direction: elevator.direction,
          };

          if (Math.random() > 0.3) {
            // 70% chance of pickup
            elevator.passengers.push(newPassenger);
            elevator.targetFloors.add(newPassenger.toFloor);
            addLog(
              `Elevator ${elevator.id} picked up passenger to floor ${newPassenger.toFloor}`,
              "pickup"
            );
          }

          setTimeout(() => {
            setElevators((prev) => {
              const updated = [...prev];
              updated[elevatorIndex] = {
                ...updated[elevatorIndex],
                isDoorOpen: false,
              };
              return updated;
            });
          }, DOOR_TIME);
        } else {
          // Move elevator
          elevator.isMoving = true;
          elevator.lastMoveTime = now;

          const nextFloor =
            elevator.direction === "up"
              ? elevator.floor + 1
              : elevator.floor - 1;

          // Check if we should change direction
          if (elevator.direction === "up" && elevator.floor === FLOORS) {
            elevator.direction =
              elevator.targetFloors.size > 0 ? "down" : "idle";
          } else if (elevator.direction === "down" && elevator.floor === 1) {
            elevator.direction = elevator.targetFloors.size > 0 ? "up" : "idle";
          } else if (
            elevator.targetFloors.size === 0 &&
            elevator.passengers.length === 0
          ) {
            elevator.direction = "idle";
          }

          if (
            elevator.direction !== "idle" &&
            ((elevator.direction === "up" && elevator.floor < FLOORS) ||
              (elevator.direction === "down" && elevator.floor > 1))
          ) {
            setTimeout(() => {
              setElevators((prev) => {
                const updated = [...prev];
                const updatedElevator = { ...updated[elevatorIndex] };
                updatedElevator.floor = nextFloor;
                updatedElevator.isMoving = false;
                updated[elevatorIndex] = updatedElevator;
                return updated;
              });
              addLog(
                `Elevator ${elevator.id} moved to floor ${nextFloor}`,
                "movement"
              );
            }, MOVE_TIME);
          } else {
            elevator.isMoving = false;
          }
        }

        newElevators[elevatorIndex] = elevator;
        return newElevators;
      });
    },
    [addLog]
  );
  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Generate random calls
      if (Math.random() < 0.3) {
        generateRandomCall();
      }

      // Assign calls to elevators
      if (calls.length > 0) {
        assignCallToElevator(calls[0]);
      }

      // Move elevators
      elevators.forEach((_, index) => {
        moveElevator(index);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    calls,
    elevators,
    generateRandomCall,
    assignCallToElevator,
    moveElevator,
  ]);

  const resetSystem = () => {
    setElevators(
      Array.from({ length: ELEVATORS_COUNT }, (_, i) => ({
        id: i + 1,
        floor: 1,
        direction: "idle" as const,
        passengers: [],
        timestamp: Date.now(),
        targetFloors: new Set<number>(),
        isMoving: false,
        isDoorOpen: false,
        lastMoveTime: 0,
      }))
    );
    setCalls([]);
    setLogs([]);
    setStats({ totalCalls: 0, totalTrips: 0, avgWaitTime: 0 });
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Elevator Control System
        </h1>

        {/* Control Panel */}
        <ControlPanel
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          totalCalls={stats.totalCalls}
          callLength={calls.length}
          resetSystem={resetSystem}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Elevators Visualization */}
          <Elevators elevators={elevators} calls={calls} />

          {/* Elevator Status & Logs */}
          <div className="space-y-6">
            {/* Elevator Status */}
            <ElevatorStatus elevators={elevators} />

            {/* Activity Log */}
            <ActivityLog logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}
