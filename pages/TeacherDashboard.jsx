import { useState } from "react";

function TeacherDashboard() {

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");

  const user = {
    id: "1",
    email: "teacher@example.com"
  };

  
  const [notes, setNotes] = useState([
    {
      id: "101",
      title: "React Basics",
      subject: "Web Dev",
      type: "PDF",
      date: "2026-01-20",
      authorId: "1"
    }
  ]);

  const myUploads = notes.filter(n => n.authorId === user.id);

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    alert("Announcement Posted");
    setAnnouncementText("");
    setShowAnnouncementForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const handleLogout = () => {
    alert("Logged out");
  };

  return (
    <div>


      <h2>Faculty Dashboard</h2>
      <p>Welcome, {user.email}</p>

      <br />

      <button>Upload</button>
      <button onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}>
        Notice
      </button>
      <button onClick={handleLogout}>Logout</button>

      <hr />

      
      <h3>Total Uploads: {myUploads.length}</h3>
      <h3>Total Downloads: 0</h3>
      <h3>Active Notices: 0</h3>

      <hr />

      
      {showAnnouncementForm && (
        <form onSubmit={handlePostAnnouncement}>
          <h3>New Announcement</h3>

          <textarea
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
          />

          <br />

          <button type="submit">Post</button>
          <button type="button" onClick={() => setShowAnnouncementForm(false)}>
            Cancel
          </button>
        </form>
      )}

      <hr />

      
      <h3>My Uploaded Resources</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Type</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {myUploads.map((note) => (
            <tr key={note.id}>
              <td>{note.title}</td>
              <td>{note.subject}</td>
              <td>{note.type}</td>
              <td>{note.date}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDelete(note.id)}>Delete</button>
              </td>
            </tr>
          ))}

          {myUploads.length === 0 && (
            <tr>
              <td colSpan="5">No uploads yet</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default TeacherDashboard;
