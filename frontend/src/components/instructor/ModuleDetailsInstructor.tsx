import React from "react";

interface ModuleDetailsProps {
  module: ModuleType;
  rating: number;
}

const ModuleDetailsInstructor: React.FC<ModuleDetailsProps> = ({ module }) => {
  return (
    <div className="space-y-2 mb-6">
      <h2 className="text-xl font-semibold text-white">{module.title}</h2>
      <p className="text-zinc-400">Difficulty: {module.difficulty}</p>
      <p className="text-zinc-400">Type: {module.type}</p>

      <p className="text-zinc-400">no of questions {module.no_question}</p>
      <p className="text-zinc-400">
        Average Rating:{" "}
        {module.ratings.length > 0
          ? (module.ratings.reduce((a: number, b: number) => a + b, 0) / module.ratings.length).toFixed(2)
          : "No ratings yet"}
      </p>
    </div>
  );
};

export default ModuleDetailsInstructor;
