import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./Routes/Login";
import { Home } from "./Routes/Home";

export function MyRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
