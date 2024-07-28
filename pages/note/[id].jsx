import { useState } from "react";
import { useMutation } from "../../hooks/useMutation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const NoteModal = ({ isOpen, onClose, toDoListId, initialNote }) => {
  const [note, setNote] = useState(initialNote);
  const router = useRouter();
  const { mutate } = useMutation();

  const handleUpdate = async () => {
    await mutate({
      url: `http://localhost:8181/api/v1/todo/${toDoListId}`,
      method: "PUT",
      payload: { note },
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });
    onClose();
    router.reload();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Update Note</h2>
          <textarea
            className="w-full p-2 border bg-gray-100 border-gray-300 rounded-xl mb-4"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Update your note..."
          />
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 mr-2"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600"
              type="button"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default NoteModal;
