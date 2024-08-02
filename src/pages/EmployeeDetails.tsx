import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeData } from "../services/employee.service";
import { format, subMonths, parseISO, isAfter } from "date-fns";

function EmployeeDetails() {
  const { employeeId } = useParams<string>();
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const isUserExists = localStorage.getItem("user");
    if (!isUserExists) {
      navigate("/");
    } else {
      const fetchEmployeeData = async () => {
        if (employeeId) {
          try {
            const response = await getEmployeeData(employeeId);
            setEmployee(response.data);
            calculateAttendanceSummary(response.data.attendanceRecords);
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An unexpected error occurred.");
            }
          } finally {
            setIsLoading(false);
          }
        }
      };

      fetchEmployeeData();
    }
  }, [employeeId, navigate]);

  const calculateAttendanceSummary = (attendanceRecords: any[]) => {
    const currentDate = new Date();
    const threeMonthsAgo = subMonths(currentDate, 3);
    const summary = {
      present: 0,
      absent: 0,
      months: {} as { [key: string]: { present: number; absent: number } },
    };

    attendanceRecords.forEach((record) => {
      const date = parseISO(record.date);
      if (isAfter(date, threeMonthsAgo)) {
        const month = format(date, "yyyy-MM");

        if (!summary.months[month]) {
          summary.months[month] = { present: 0, absent: 0 };
        }

        if (record.status === "Present") {
          summary.present += 1;
          summary.months[month].present += 1;
        } else if (record.status === "Absent") {
          summary.absent += 1;
          summary.months[month].absent += 1;
        }
      }
    });

    setAttendanceSummary(summary);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6 mb-5 mt-5">
          {isLoading ? (
            <h2>Loading employee details...</h2>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div>
              <h1 className="mb-4">Employee Details</h1>
              {employee ? (
                <div>
                  <p>
                    <strong>Employee ID:</strong> {employee.employeeId}
                  </p>
                  <p>
                    <strong>Name:</strong> {employee.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {employee.email}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {employee.phoneNumber}
                  </p>
                  <p>
                    <strong>PAN Number:</strong> {employee.panNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {employee.address}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong> {employee.dateOfBirth}
                  </p>
                  <p>
                    <strong>Joining Date:</strong> {employee.joiningDate}
                  </p>
                  <p>
                    <strong>Designation:</strong> {employee.designation}
                  </p>
                  <p>
                    <strong>Department:</strong> {employee.department}
                  </p>
                  <p>
                    <strong>Employment Status:</strong>{" "}
                    {employee.employmentStatus}
                  </p>
                </div>
              ) : (
                <p>No employee data found.</p>
              )}
            </div>
          )}
        </div>

        <div className="col-12 col-md-6 mb-5 mt-5">
          {isLoading ? (
            <h2>Loading employee Attendance Summary...</h2>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div>
              <h1 className="mb-4">Attendance Summary</h1>
              {attendanceSummary ? (
                <div>
                  <p>
                    <strong>Total Present:</strong> {attendanceSummary.present}
                  </p>
                  <p>
                    <strong>Total Absent:</strong> {attendanceSummary.absent}
                  </p>
                  <h2>Monthly Breakdown</h2>
                  <div className="row temp-row-2">
                    {Object.keys(attendanceSummary.months).map((month) => (
                      <div className="col-6 mb-3" key={month}>
                        <h3>{month}</h3>
                        <p>
                          <strong>Present:</strong>{" "}
                          {attendanceSummary.months[month].present}
                        </p>
                        <p>
                          <strong>Absent:</strong>{" "}
                          {attendanceSummary.months[month].absent}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No attendance data available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
