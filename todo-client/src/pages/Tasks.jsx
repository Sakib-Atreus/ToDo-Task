import React, { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard"; // Import the TaskCard component

const Tasks = () => {
  const [tasks, setTasks] = useState({
    inComplete: [],
    toDo: [],
    doing: [],
    underReview: [],
    completed: [],
    overDated: [],
  });

  // Category name mapping
  const categoryNames = {
    inComplete: "Incomplete",
    toDo: "To Do",
    doing: "Doing",
    underReview: "Under Review",
    completed: "Completed",
    overDated: "Over Dated",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://todo-server-rose.vercel.app/task");
        const data = await response.json();

        // Ensure each task has an 'attachments' array
        const categorizedTasks = {
          inComplete: data.filter((task) => task.category === "Incomplete"),
          toDo: data.filter((task) => task.category === "To Do"),
          doing: data.filter((task) => task.category === "Doing"),
          underReview: data.filter((task) => task.category === "Under Review"),
          completed: data.filter((task) => task.category === "Completed"),
          overDated: data.filter((task) => task.category === "OverDated"),
        };

        // Ensure each task has an 'attachments' array initialized
        const tasksWithAttachments = Object.keys(categorizedTasks).reduce((acc, category) => {
          acc[category] = categorizedTasks[category].map(task => ({
            ...task,
            attachments: task.attachments || [], // Ensure attachments is initialized as an array
          }));
          return acc;
        }, {});

        setTasks(tasksWithAttachments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileUpload = (taskId, newFileCount, attachments) => {
    const updatedTasks = { ...tasks };

    // Find the task by taskId and update its file count and attachments
    for (const category in updatedTasks) {
      const taskIndex = updatedTasks[category].findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        updatedTasks[category][taskIndex] = {
          ...updatedTasks[category][taskIndex],
          fileCount: newFileCount,
          attachments: [
            ...(updatedTasks[category][taskIndex].attachments || []), // Ensure attachments is an array
            ...attachments,
          ],
        };
        break;
      }
    }

    setTasks(updatedTasks);
  };

  return (
    <div className="grid grid-flow-col w-[1490px] mx-auto overflow-x-scroll whitespace-nowrap space-x-4 bg-white p-4">
      {/* Render categories dynamically */}
      {Object.keys(tasks).map((category) => (
        <div
          key={category}
          className="w-72 p-2 border-2 border-black bg-gray-200 text-black border-none"
        >
          <div className="flex justify-between px-2 py-2">
            <div className="flex items-center gap-2">
              <p
                className={`w-6 h-6 rounded-l-xl ${
                  category === "inComplete"
                    ? "bg-red-600"
                    : category === "toDo"
                    ? "bg-sky-500"
                    : category === "doing"
                    ? "bg-yellow-400"
                    : ""
                }`}
              ></p>
              <h1 className="text-xl font-semibold">
                {categoryNames[category] || category} {/* Use the mapping */}
              </h1>
            </div>
            <p className="text-lg font-semibold">{tasks[category].length}</p>
          </div>

          <div className="grid grid-cols-1 gap-2 h-[560px] overflow-y-scroll">
            {tasks[category].map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onFileUpload={handleFileUpload} // Pass the handleFileUpload function
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
