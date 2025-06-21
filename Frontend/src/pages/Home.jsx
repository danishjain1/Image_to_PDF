import React from "react";
import { tools } from "../data/tools";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <h1 className="text-4xl font-bold mb-6">DJ PDF Maker</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            to={tool.path}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <div className="text-2xl mb-2">{tool.icon}</div>
            <h2 className="text-xl font-semibold">{tool.title}</h2>
            <p className="text-sm text-gray-300">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
