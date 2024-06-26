// import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();

    if (!title || !summary || !content || !files) {
      toast.error("All fields are required!");
      return;
    }

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('image', files[0]);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to create a post.");
      return;
    }

    try {
      const response = await fetch('https://homeworktips-22mg.onrender.com/create-post', {
        method: 'POST',
        body: data,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Post created successfully!');
        setRedirect(true);
      } else {
        toast.error(result.error || 'Failed to create post');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form onSubmit={createNewPost} className="w-full flex flex-col min-h-[100vh] items-center mt-10 pb-10">
      <ToastContainer />
      <h1 className="text-xl my-5 font-semibold">Create New Post</h1>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)}
             className="md:w-[50%] w-[80%] h-[45px] px-3 rounded-lg border border-[#51B73B] outline-2 outline-[#51B73B]" />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)}
             className="md:w-[50%] w-[80%] h-[45px] px-3 rounded-lg border border-[#51B73B] outline-2 outline-[#51B73B] mt-3" />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)}
             className="md:w-[50%] w-[80%] h-[45px] px-3 rounded-lg border-[#51B73B] outline-2 outline-[#51B73B] my-5" />
      <Editor value={content} onChange={setContent} />
      <button className="md:w-[50%] w-[80%] h-[45px] px-3 rounded-lg bg-[#51B73B] outline-2 mt-5 text-lime-50 text-xl hover:bg-[#97c98c]">Create post</button>
    </form>
  );
}
