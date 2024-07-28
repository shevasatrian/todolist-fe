import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useMutation } from "../hooks/useMutation";
import { useQueries } from "../hooks/useQueries";
import NoteModal from "./note/[id]";

const inter = Inter({ subsets: ["latin"] });
const LayoutComponent = dynamic(() => import("../layout"))

export default function Main() {

  const router = useRouter();
  const { mutate } = useMutation();
  const [payload, setPayload] = useState({
    note: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [checkedNotes, setCheckedNotes] = useState({});

  const handleSubmit = async () => {
    await mutate({
      url: "http://localhost:8181/api/v1/todo",
      payload,
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      }
    });
    router.reload();
  }

  const { data, refetch } = useQueries({
    prefixUrl: "http://localhost:8181/api/v1/todo",
    headers: {
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    }
  })

  const handleDelete = async (toDoListId) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      await mutate({
        url: `http://localhost:8181/api/v1/todo/${toDoListId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("user_token")}`,
        }
      });
      router.reload();
    }
  }

  const handleLogout = () => {
    Cookies.remove('user_token');
    router.push('/login');
  };
  
  const handleUpdateClick = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  }

  const handleCheckboxChange = (noteId) => {
    setCheckedNotes(prevState => ({
      ...prevState,
      [noteId]: !prevState[noteId]
    }));
  };

  return (
    <>
      <LayoutComponent metaTitle="Home Page" metaDescription="This is the home page">

        <div className="flex items-center justify-center min-h-screen bg-gray-200">
          <div className="container bg-white rounded-2xl w-1/2 h-[480px] shadow-md lg:mx-32 md:mx-36">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl">Todo</h2>
                <div>
                  <button
                    onClick={() => handleLogout()}
                    className="mt-2 mr-1 px-4 bg-red-500 text-white p-2 rounded-2xl hover:bg-red-600"
                    type="button"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => handleSubmit()}
                    className="mt-2 px-6 bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600"
                    type="button"
                  >
                    Create Todolist
                  </button>
                </div>
              </div>
              <div className="py-3">
                <textarea
                  className="w-full p-2 border bg-gray-100 border-gray-300 rounded-xl"
                  rows="3"
                  value={payload?.note}
                  onChange={(event) => setPayload({ ...payload, note: event.target.value })}
                  placeholder="Write your list..."                  
                />
              </div>

              <div className="overflow-y-auto max-h-svh">
                {data?.map((note) => (
                    <div key={note.id} className={`py-2 mb-2 border rounded-xl flex items-center justify-between ${checkedNotes[note.id] ? "bg-red-200" : "bg-sky-200"}`}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!checkedNotes[note.id]}
                          onChange={() => handleCheckboxChange(note.id)}
                          className="ml-2"
                        />
                        <p className="pl-2">{note.note}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => handleUpdateClick(note)}
                          className="mr-1 bg-blue-500 text-white py-1 px-2 rounded-xl hover:bg-blue-600"
                          type="button"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="mr-1 bg-red-500 text-white py-1 px-2 rounded-xl hover:bg-red-600"
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
                
            </div>
          </div>
        </div>

      </LayoutComponent>

      {showModal && selectedNote && (
          <NoteModal 
            isOpen={showModal}
            onClose={() => { setShowModal(false); refetch(); }}
            toDoListId={selectedNote.id}
            initialNote={selectedNote.note}
           />
        )}
    </>
  );
}
