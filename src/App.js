import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Connect to backend

const workers = [
  "Thomas",
  "Wes",
  "Tom",
  "Larry",
  "Wendell",
  "Mark",
  "Ian",
  "Melissa",
  "Tay",
];

const statuses = ["Busy", "Available", "Onsite", "Lunch", "Off"];

const statusColorMap = {
  Busy: "danger", // green
  Available: "success",
  Onsite: "warning", // yellow
  Lunch: "info", // light blue
  Off: "secondary", // gray
};

function App() {
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    socket.on("status-update", (data) => {
      setStatusMap((prev) => ({ ...prev, ...data }));
    });
  }, []);

  const handleStatusChange = (name, newStatus) => {
    const update = { [name]: newStatus };
    setStatusMap((prev) => ({ ...prev, ...update }));
    socket.emit("status-update", update);
  };

  return (
    <div className="container-fluid py-4 px-3">
      <h1 className="text-center mb-4">Team Status Dashboard</h1>
      <div className="row g-3">
        {workers.map((name) => (
          <div key={name} className="col-12 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <div className="mb-3">
                  <h5>{name}</h5>
                  <span
                    className={`badge bg-${
                      statusColorMap[statusMap[name]] || "secondary"
                    }`}
                  >
                    {statusMap[name] || "No status"}
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(name, status)}
                      className={`btn btn-sm ${
                        statusMap[name] === status
                          ? `btn-${statusColorMap[status] || "primary"}`
                          : `btn-outline-${
                              statusColorMap[status] || "secondary"
                            }`
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
