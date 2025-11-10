import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  floor: number;
  description: string;
  availability: boolean;
  branch: string;
}

interface RoomSelectorProps {
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string, roomName?: string) => void;
}

type Branch = "Kottawa" | "Mirissa";

const RoomSelector: React.FC<RoomSelectorProps> = ({
  selectedRoomId,
  onRoomSelect,
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch>("Kottawa");

  useEffect(() => {
    const loadRooms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/rooms/list?branch=${selectedBranch}`
        );
        if (!response.ok) throw new Error("Failed to load rooms");

        const data = await response.json();
        setRooms(data.rooms);

        // Auto-select first AVAILABLE room if none selected
        if (data.rooms.length > 0 && !selectedRoomId) {
          const firstAvailableRoom = data.rooms.find(
            (room: Room) => room.availability
          );
          if (firstAvailableRoom) {
            onRoomSelect(firstAvailableRoom._id, firstAvailableRoom.name);
          }
        }
      } catch (error) {
        console.error("Error loading rooms:", error);
        toast.error("Failed to load available rooms");
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, [selectedBranch]); // Reload when branch changes

  const handleRoomSelect = (room: Room) => {
    if (!room.availability) {
      toast.error(`${room.name} is currently unavailable`);
      return;
    }
    onRoomSelect(room._id, room.name);
  };

  const handleBranchChange = (branch: Branch) => {
    setSelectedBranch(branch);
    // Clear selection when changing branches
    onRoomSelect("");
  };

  const filteredRooms = rooms.filter((room) => room.branch === selectedBranch);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Select a Meeting Room
      </h3>

      {/* Branch Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => handleBranchChange("Kottawa")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors cursor-pointer ${
            selectedBranch === "Kottawa"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Coworking Cube - Kottawa
        </button>
        <button
          onClick={() => handleBranchChange("Mirissa")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors cursor-pointer ${
            selectedBranch === "Mirissa"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Coworking Cube - Mirissa
        </button>
      </div>

      {filteredRooms.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          No rooms available at {selectedBranch} branch
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => {
            const isAvailable = room.availability;
            const isSelected = selectedRoomId === room._id;

            return (
              <button
                key={room._id}
                onClick={() => handleRoomSelect(room)}
                disabled={!isAvailable}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  !isAvailable
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                    : isSelected
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{room.name}</h4>
                  {!isAvailable && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Unavailable
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                <div className="flex gap-2 mt-2 text-xs text-gray-600">
                  <span>👥 {room.capacity} people</span>
                  <span>🏢 Floor {room.floor}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
