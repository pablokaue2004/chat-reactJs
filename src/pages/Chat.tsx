import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface Message {
  user: any;
  content: string;
}

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    const newMessage: Message = {
      user: user, 
      content: message,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
    console.log(newMessage);
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    navigate("/");
  };

  const back = () => {
    navigate("/");
  };

  const deleteMessage = (index: number) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="tw-h-screen tw-bg-gray-800 tw-w-full tw-flex tw-items-center tw-justify-center tw-font-bold tw-text-white tw-flex-col">
        Você precisa de um usuário para acessar essa página
        <button
          className="tw-px-8 tw-py-2 tw-bg-slate-500 tw-rounded-md tw-text-white hover:tw-bg-slate-700 tw-duration-150 tw-mt-3"
          onClick={back}
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="tw-h-screen tw-bg-gray-800 tw-w-full tw-flex tw-items-center tw-justify-center tw-flex-col">
      <div className="tw-flex tw-w-[80%] tw-items-start">
        <button
          className="tw-px-8 tw-py-2 tw-bg-slate-500 tw-rounded-md tw-text-white hover:tw-bg-slate-700 tw-duration-150 tw-mb-2"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
      <div className="tw-w-[80%] tw-h-[80%] tw-bg-gray-300 tw-rounded-md tw-shadow-lg tw-p-5 tw-flex tw-flex-col">
        <div className="tw-flex-grow tw-overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              className="tw-px-4 tw-py-3 tw-bg-gray-100 tw-rounded-md tw-mb-2"
              key={index}
            >
              <div>
                <div className="tw-flex tw-justify-between tw-items-center">
                  <p className="tw-font-extrabold">{`${msg.user.user.firstName} ${msg.user.user.lastName}`}</p>
                  <button onClick={() => deleteMessage(index)}>
                    <svg
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      stroke-linejoin="round"
                      stroke-miterlimit="2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="tw-w-6 tw-h-6 tw-text-red-600"
                    >
                      <path
                        d="m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z"
                        fill-rule="nonzero"
                      />
                    </svg>
                  </button>
                </div>
                <p className="tw-break-words tw-mt-2">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tw-w-full tw-flex tw-mt-2">
          <input
            type="text"
            className="tw-flex-grow tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-p-2.5 tw-mr-2"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="tw-px-8 tw-py-2 tw-bg-slate-500 tw-rounded-md tw-text-white hover:tw-bg-slate-700 tw-duration-150"
            onClick={handleSendMessage}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
