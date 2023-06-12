import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import * as Yup from "yup";

export const Login = () => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const newSocket: Socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("authenticated", (user) => {
      navigate("/chat", { state: { user } });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigate]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("O primeiro nome é obrigatório"),
    lastName: Yup.string().required("O último nome é obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validationSchema,
    onSubmit: (values) => {
      socket?.emit("login", values, (response: any) => {
        if (response.success) {
          navigate("/chat"); 
        } else {
          console.log("deu erro");
        }
      });
    },
  });

  return (
    <div className="tw-h-screen tw-bg-gray-800 tw-w-full tw-flex tw-items-center tw-justify-center">
      <div className="tw-w-[20%] tw-h-auto tw-bg-gray-300 tw-rounded-md tw-shadow-lg tw-p-5 tw-flex tw-items-center tw-justify-start tw-flex-col">
        <p className="tw-font-bold tw-text-3xl">Chat</p>
        <form onSubmit={formik.handleSubmit} className="tw-w-full">
          <div className="tw-w-full">
            <label
              htmlFor="first_name"
              className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900"
            >
              Primeiro Nome
            </label>
            <input
              type="text"
              id="first_name"
              className="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5"
              placeholder="Chico"
              {...formik.getFieldProps("firstName")}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="tw-text-red-500">{formik.errors.firstName}</div>
            )}
          </div>
          <div className="tw-w-full">
            <label
              htmlFor="last_name"
              className="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900"
            >
              Segundo Nome
            </label>
            <input
              type="text"
              id="last_name"
              className="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5"
              placeholder="Bento"
              {...formik.getFieldProps("lastName")}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="tw-text-red-500">{formik.errors.lastName}</div>
            )}
          </div>
          <button
            type="submit"
            className="tw-px-8 tw-py-2 tw-bg-slate-500 tw-rounded-md tw-text-white tw-mt-4 hover:tw-bg-slate-700 tw-duration-150"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
