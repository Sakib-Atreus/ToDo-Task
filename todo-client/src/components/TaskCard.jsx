import React, { useState } from "react";
import { IoServer } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";
import { SlCalender } from "react-icons/sl";
import { RiAttachment2 } from "react-icons/ri";

const TaskCard = ({ task, onFileUpload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // Handle file input change to add new files to existing attachments
  const handleFileChange = (e) => {
    const newFiles = e.target.files;
    setAttachments((prevFiles) => [
      ...prevFiles,
      ...Array.from(newFiles), // Merge previous files with the new ones
    ]);
  };

  // Handle modal toggle
  const handleAttachmentClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle submit to update the frontend only
  const handleSubmit = () => {
    // Update the file count with the new number of attached files
    const newFileCount = task.fileCount + attachments.length;

    // Call the onFileUpload function to update the task in the parent component
    onFileUpload(task.id, newFileCount, attachments);

    // Reset the file input and close modal after submission
    setAttachments([]);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white text-black px-2 py-2">
      <div className="overflow-y-auto space-y-4">
        <div className="flex justify-between text-xs my-4">
          <div className="flex gap-2 items-center">
            <img
              className="rounded-full w-6 h-6"
              src="https://imgcdn.stablediffusionweb.com/2024/4/7/76683d35-d0e9-4bf4-a630-99a6cc7da8c2.jpg"
              alt=""
            />
            <p>Client Name</p>
          </div>
          <div className="flex gap-2 items-center">
            <img
              className="rounded-full w-6 h-6"
              src="https://imgcdn.stablediffusionweb.com/2024/4/7/76683d35-d0e9-4bf4-a630-99a6cc7da8c2.jpg"
              alt=""
            />
            <p>Name</p>
          </div>
        </div>
        <div className="flex justify-between py-4 text-xs">
          <div className="flex gap-2 items-center">
            <IoServer />
            <p>Text Lorem ipsum dolor sit ame...</p>
          </div>
          <div className="flex gap-2 items-center">
            <IoServer />
            <p>1/2</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs items-center">
        <img
          className="rounded-full w-6 h-6"
          src="https://imgcdn.stablediffusionweb.com/2024/4/7/76683d35-d0e9-4bf4-a630-99a6cc7da8c2.jpg"
          alt=""
        />
        <img
          className="rounded-full w-6 h-6"
          src="https://imgcdn.stablediffusionweb.com/2024/4/7/76683d35-d0e9-4bf4-a630-99a6cc7da8c2.jpg"
          alt=""
        />
        <p>12+</p>
        <p className="flex items-center gap-1">
          <TiMessages />
          15
        </p>
        <p
          className="flex items-center gap-1 cursor-pointer"
          onClick={handleAttachmentClick}
        >
          <RiAttachment2 /> {task.fileCount}
        </p>
        <p className="flex items-center gap-1">
          <SlCalender /> 30-12-2022
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-semibold">Upload Attachments</h2>
            {/* File Input */}
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border p-2 rounded-md w-full"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleSubmit}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
