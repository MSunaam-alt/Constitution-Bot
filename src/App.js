import "./App.css";
import Footer from "./Footer";
import Nav from "./Nav";
import { useEffect, useRef, useState } from "react";
import DraggableComponent from "./DraggableComponent";
import axios from "axios";
import { variables } from "./constants";
import Chat from "./Chat";
import Toast from "./Toast";

function App() {
  const constitution = [
    {
      id: 1,
      name: "Pakistan's",
      img: "/pak.png",
      file: "/pakistan.pdf",
    },
    {
      id: 2,
      name: "American",
      img: "/us.png",
      file: "/us.pdf",
    },
    ,
    {
      id: 3,
      name: "Australian",
      img: "/aus.png",
      file: "/australia.pdf",
    },
    ,
    {
      id: 4,
      name: "France's",
      img: "/france.png",
      file: "/france.pdf",
    },
  ];
  useEffect(() => {
    document.title = "Constitution Bot";
  }, []);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [dragged, setDragged] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [draggedOver, setDraggedOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setShowToast(false);
      setToastMsg(null);
    }, 5000);
  }, [showToast]);

  const triggerToast = (msg) => {
    setShowToast(true);
    setToastMsg(msg);
  };

  const handleSelect = async (e) => {
    triggerToast(`Loading ${e.name} Constitution`);
    setSelectedId(e.id);
    setDraggedOver(false);
    setLoading(true);
    if (localStorage.getItem(e.name)) {
      setSelected(localStorage.getItem(e.name));
      setLoading(false);
      return;
    }

    const response = await fetch(e.file);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const fileBlob = await response.blob();

    const file = new File([fileBlob], "file.ext", { type: fileBlob.type });

    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(variables["addFile"], formData, {
        headers: { "x-api-key": variables["apiKey"] },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem(e.name, res.data.sourceId);
        setSelected(res.data.sourceId);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  async function handleDrop(e) {
    triggerToast(`Loading ${dragged.name} Constitution`);
    setSelectedId(dragged.id);
    setDraggedOver(false);
    setLoading(true);
    e.preventDefault();
    if (localStorage.getItem(dragged.name)) {
      setSelected(localStorage.getItem(dragged.name));
      setLoading(false);
      return;
    }

    const response = await fetch(dragged.file);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const fileBlob = await response.blob();

    const file = new File([fileBlob], "file.ext", { type: fileBlob.type });

    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(variables["addFile"], formData, {
        headers: { "x-api-key": variables["apiKey"] },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem(dragged.name, res.data.sourceId);
        setSelected(res.data.sourceId);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }
  return (
    <>
      <main className="px-4 md:px-0 container mx-auto min-h-screen">
        {showToast && <Toast msg={toastMsg} />}
        <Nav />
        <section className="flex flex-col items-center justify-center gap-10 my-10">
          <div className="w-full flex flex-col">
            <select
              onChange={(e) => {
                console.log(e.target.value);
                let selected = constitution.filter(
                  (item) => item.id == e.target.value
                );

                handleSelect(selected[0]);
              }}
              name="constitution"
              className="block md:hidden py-1 px-2 bg-white border border-black rounded-lg"
            >
              <option value="">-- Select an option --</option>
              {constitution.map((data, idx) => {
                return (
                  <>
                    <option value={data.id}>{data.name} Constitution</option>
                  </>
                );
              })}
            </select>
          </div>
          <div className="md:flex flex-col md:flex-row w-full justify-around hidden">
            {constitution.map((data, idx) => {
              return (
                <>
                  <DraggableComponent
                    selected={selectedId === data.id}
                    key={idx}
                    d={data}
                    setDragged={setDragged}
                    setDraggedOver={setDraggedOver}
                  />
                </>
              );
            })}
          </div>
          <div
            className={`hidden md:flex items-center text-center justify-center border-4 border-dashed ${
              draggedOver ? "border-blue-600" : "border-gray-500"
            } w-full h-40`}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={handleDrop}
          >
            {!loading && !draggedOver && (
              <span className="text-gray-700">
                Drag & Drop Constitution Here to Begin QA Session
              </span>
            )}
            {!loading && draggedOver && (
              <span className="text-blue-600 text-xl">Drop</span>
            )}
            {loading && <div className="loader"></div>}
          </div>
        </section>
        {selected && <Chat sourceId={selected} />}
      </main>
      <Footer />
    </>
  );
}

export default App;
