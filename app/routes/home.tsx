import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import NavBar from "components/NavBar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <NavBar />
      <h1 className="text-2xl text-indigo-700 font-extrabold">
        Home
      </h1>
    </div>
  )
}
