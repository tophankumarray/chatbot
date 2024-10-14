import React from "react";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Body from "./Component/Body/Body";

const App = () => {
  return (
    <div>
      <Body />
      <Toaster />
    </div>
  );
};

export default App;
