import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees } from "../services/employee.service";

function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isUserExists = localStorage.getItem("user");
    if (!isUserExists) {
      navigate("/");
    } else {
      const userData = JSON.parse(isUserExists);
      setUser(userData);

      const fetchEmployees = async () => {
        try {
          const res = await getEmployees();
          setEmployees(res.data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred.");
          }
        } finally {
          setIsDataLoading(false);
        }
      };

      fetchEmployees();
    }
  }, [navigate]);

  return (
    <div className="container">
      <div className="row">
        <div className="col mb-5 mt-5">
          <h1>Welcome {user?.firstName}!</h1>
          {isDataLoading ? (
            <h2>Data is Loading....</h2>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Employee ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Joining Date</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Department</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Employment Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr
                    key={employee.employeeId}
                    onClick={() =>
                      navigate(`/EmployeeDetails/${employee.employeeId}`)
                    }
                  >
                    <th scope="row">{index + 1}</th>
                    <td>{employee.employeeId}</td>
                    <td>{employee.name}</td>
                    <td>{employee.joiningDate}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.department}</td>
                    <td>{employee.phoneNumber}</td>
                    <td>{employee.employmentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
