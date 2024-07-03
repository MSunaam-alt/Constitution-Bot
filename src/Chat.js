import { useRef, useState } from "react";
import { variables } from "./constants";
import axios from "axios";
import { ImHeadphones } from "react-icons/im";
import { IconContext } from "react-icons";
import { FaPlay } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

export default function Chat({ sourceId }) {
  const sendButtonRef = useRef(null);
  const inputRef = useRef(null);
  const [sentMessage, setSentMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ttsText, setTTsText] = useState(null);
  const [ttsPlaying, setTtsPlaying] = useState(false);

  const synth = window.speechSynthesis;

  const playTTS = () => {
    if (ttsText) {
      const utterThis = new SpeechSynthesisUtterance(ttsText);
      setTtsPlaying(true);
      utterThis.addEventListener("end", () => {
        setTtsPlaying(false);
      });
      synth.speak(utterThis);
    } else {
      console.log("Error Loading TTS");
    }
  };

  const handleClick = () => {
    if (inputRef == null || inputRef.current.value == "") return;
    askPdf();
    inputRef.current.value = "";
  };
  const askPdf = () => {
    setLoading(true);
    axios
      .post(
        variables["askQuestion"],
        {
          sourceId: sourceId,
          messages: [
            {
              role: "user",
              content: sentMessage,
            },
          ],
        },
        {
          headers: {
            "x-api-key": variables["apiKey"],
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log(sentMessage);
        setMessageHistory([
          ...messageHistory,
          { message: sentMessage, response: res.data.content },
        ]);
        setTTsText(res.data.content);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <section className="flex flex-col items-end justify-start gap-2 my-10 ">
        {messageHistory.map((msg, idx) => {
          return (
            <div
              className="w-full flex flex-col-reverse gap-2 text-white"
              key={idx}
            >
              <div className="w-full">
                <p className="md:w-2/4 bg-chatGrey pl-4 pr-10 py-4 rounded-xl text-left ">
                  {msg.response}
                </p>
              </div>
              <div className="w-full flex justify-end">
                <p className="md:w-2/4 pl-4 pr-10 py-4 rounded-xl text-left bg-chatBlue">
                  {msg.message}
                </p>
              </div>
            </div>
          );
        })}
        <div className="flex items-center gap-2 w-full lg:w-1/2">
          {ttsText && !ttsPlaying && (
            <div
              className="mr-2"
              onClick={() => {
                playTTS();
              }}
            >
              <IconContext.Provider value={{ size: "1.2rem", color: "black" }}>
                <ImHeadphones />
              </IconContext.Provider>
            </div>
          )}
          {!ttsText && (
            <div className="cursor-not-allowed mr-2">
              <IconContext.Provider value={{ size: "1.2rem", color: "grey" }}>
                <ImHeadphones />
              </IconContext.Provider>
            </div>
          )}
          {ttsPlaying && (
            <div className="mr-2">
              <IconContext.Provider value={{ size: "1.2rem", color: "grey" }}>
                <FaPlay />
              </IconContext.Provider>
            </div>
          )}
          {messageHistory.length != 0 && (
            <button
              onClick={() => {
                setMessageHistory([]);
                setTTsText(null);
              }}
            >
              <IconContext.Provider value={{ size: "1.5rem" }}>
                <IoMdCloseCircle />
              </IconContext.Provider>
            </button>
          )}
          <input
            ref={inputRef}
            onChange={(e) => {
              setSentMessage(e.target.value);
            }}
            type="text"
            className="border rounded-lg w-full border-black focus:outline-none px-2 py-1"
            onKeyDown={(e) => {
              if (e.code == "Enter") {
                if (sendButtonRef != null) {
                  sendButtonRef.current.click();
                }
              }
            }}
          />
          {!loading && (
            <button
              onClick={handleClick}
              ref={sendButtonRef}
              className="px-4 py-1 border border-transparent bg-black text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out hover:border-black rounded-lg"
            >
              Send
            </button>
          )}
          {loading && (
            <button
              onClick={handleClick}
              ref={sendButtonRef}
              className="px-4 border border-transparent bg-white"
            >
              <div className="loader-small"></div>
            </button>
          )}
        </div>
      </section>
    </>
  );
}
