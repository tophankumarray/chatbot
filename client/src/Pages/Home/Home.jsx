import React, { useState } from "react";
import Header from "../../Component/Header/Header";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { LoadingSmall } from "../../Component/Loading/Loading";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const messageHandler = async (e) => {
    e.preventDefault();
    if (prompt === "") {
      return alert("Write Prompt");
    }
    setNewRequestLoading(true);
    setPrompt("");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=Your-api-key",
        method: "post",
        data: {
          contents: [{ parts: [{ text: prompt }] }],
        },
      });

      const message = {
        question: prompt,
        answer:
          response["data"]["candidates"][0]["content"]["parts"][0]["text"],
      };
      setMessages((prev) => [...prev, message]);
      setNewRequestLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="pt-20 bg-slate-900 text-white h-screen ">
        <div className="flex-1 p-6 mb-20 md:mb-0">
          {loading ? (
            "<LoadingBig />"
          ) : (
            <div className="flex-1 p-6 max-h-[600px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar">
              {messages && messages.length > 0 ? (
                messages.map((e, i) => (
                  <div key={i}>
                    <div className="mb-4 p-4 rounded bg-blue-700 text-white flex gap-1 items-center">
                      <div className="bg-white p-2 rounded-full text-black text-2xl h-10">
                        <CgProfile />
                      </div>
                      {e.question}
                    </div>

                    <div className="mb-4 p-4 rounded bg-gray-700 text-white flex gap-1 items-center">
                      <div className="bg-white p-2 rounded-full text-black text-2xl h-10">
                        <FaRobot />
                      </div>
                      <p>{e.answer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No chat yet</p>
              )}

              {newRequestLoading && <LoadingSmall />}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-auto p-4 bg-gray-900 w-full md:w-[75%]">
        <form
          onSubmit={messageHandler}
          className="flex justify-center items-center"
        >
          <input
            className="flex-grow p-4 bg-gray-700 rounded-l text-white outline-none"
            type="text"
            placeholder="Enter a prompt here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
          <button className="p-4 bg-gray-700 rounded-r text-2xl text-white">
            <IoMdSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
