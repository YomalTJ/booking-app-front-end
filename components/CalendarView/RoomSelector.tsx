import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  floor: number;
  description: string;
}

interface RoomSelectorProps {
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({
  selectedRoomId,
  onRoomSelect,
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/rooms/list");
        if (!response.ok) throw new Error("Failed to load rooms");

        const data = await response.json();
        setRooms(data.rooms);

        if (data.rooms.length > 0 && !selectedRoomId) {
          onRoomSelect(data.rooms[0]._id);
        }
      } catch (error) {
        console.error("Error loading rooms:", error);
        toast.error("Failed to load available rooms");
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, []);

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
        Select A Meeting Room
      </h3>
      {rooms.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No rooms available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => onRoomSelect(room._id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedRoomId === room._id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
            >
              <h4 className="font-semibold text-gray-800">{room.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{room.description}</p>
              <div className="flex gap-2 mt-2 text-xs text-gray-600">
                <span>👥 {room.capacity} people</span>
                <span>🏢 Floor {room.floor}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
