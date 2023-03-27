import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { RootComponent, Home, ActivatePeer } from "./pages";
import styled from "styled-components";
import { useClientContext } from "pocketbase-react";

function App() {
  const client = useClientContext();
  useEffect(()=>{
    client?.autoCancellation(false);
  },[])
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootComponent />,
      ErrorBoundary: () =><ErrorWrapper><PuffLoader color="#929292" title="Error!" /></ErrorWrapper>,
      children: [
        {
          index: true,
          path: "/",
          element: <Home />,
          // loader: async ({ params }) => {
          //   return [];
          // },
        },
        {
          path: "/activate",
          element: <ActivatePeer />,
          // loader: async ({ params }) => {
          //   return [];
          // },
        }
      ]
    },
  ], {
    basename: "/"
  });
  return (
    <RouterProvider
      router={router}
      fallbackElement={<PuffLoader color="#929292" title="Nothing here!" />}
    />
  );
}
const ErrorWrapper = styled.div`
  width: 98vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default App;

