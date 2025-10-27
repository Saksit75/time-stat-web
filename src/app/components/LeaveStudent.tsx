"use client";
import { useState, useEffect } from "react";

type StudentData = {
  id: number;
  student_id: string;
  student_number: string;
  title: string;
  first_name: string;
  last_name: string;
  gender: string;
};

type studentsByClassType = {
  class_id: number;
  class_level_th: string;
  data: StudentData[];
};

type LeaveStudentProps = {
  studentsByClass: studentsByClassType;
  initialData?: Record<number, AttendanceStatus>;
  onAttendanceChange?: (data: Record<number, AttendanceStatus>) => void;
};

type AttendanceStatus = "come" | "absent" | "leave" | "sick" | "late";

const LeaveStudent = ({ studentsByClass, initialData = {}, onAttendanceChange }: LeaveStudentProps) => {
  const [attendanceData, setAttendanceData] = useState<Record<number, AttendanceStatus>>(initialData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync state เมื่อ initialData เปลี่ยน (เมื่อเปิด modal ใหม่)
  useEffect(() => {
    setAttendanceData(initialData);
    // setIsInitialized(true);
  }, [initialData]);

  // ส่งข้อมูลกลับไปยัง parent component เมื่อ attendanceData เปลี่ยน (แต่ไม่ใช่ตอน initialize)
  useEffect(() => {
    if (isInitialized && onAttendanceChange) {
      onAttendanceChange(attendanceData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceData, isInitialized]);

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "come": return "bg-green-100/10 border-green-300";
      case "absent": return "bg-red-100/10 border-red-300";
      case "leave": return "bg-yellow-100/10 border-yellow-300";
      case "sick": return "bg-orange-100/10 border-orange-300";
      case "late": return "bg-blue-100/10 border-blue-300";
      default: return "bg-white/10 border-gray-300";
    }
  };

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Early return ต้องอยู่หลังจาก hooks ทั้งหมด
  if (!studentsByClass || !studentsByClass.data || studentsByClass.data.length === 0) {
    return (
      <div className="w-full text-center text-gray-400 py-8">
        ไม่พบข้อมูลนักเรียน
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-gray-400">
        จำนวนนักเรียนทั้งหมด: {studentsByClass.data.length} คน
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {studentsByClass.data
          .slice()
          .sort((a, b) => Number(a.student_number) - Number(b.student_number))
          .map((student, index) => (
          <div 
            key={student.id} 
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              attendanceData[student.id] ? getStatusColor(attendanceData[student.id]) : "bg-green-100/10 border-green-300"
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="font-medium min-w-8">
                {index + 1}.
              </span>
              <span className="font-medium">
                {student.title}{student.first_name} {student.last_name}
              </span>
              <span className="text-sm">
                (เลขที่ {student.student_number}) ({student.gender === "m" ? "ชาย" : student.gender === "f" ? "หญิง" : "-"})
              </span>
            </div>
            
            <select
              value={attendanceData[student.id] || "come"}
              onChange={(e) => handleStatusChange(student.id, e.target.value as AttendanceStatus)}
              className="select w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-base-200 cursor-pointer"
            >
              <option value="come">มาเรียน</option>
              <option value="absent">ขาด</option>
              <option value="leave">ลา</option>
              <option value="sick">ป่วย</option>
              <option value="late">มาสาย</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100/10 border border-green-300 rounded"></div>
            <span>มาเรียน: {studentsByClass.data.filter(s => !attendanceData[s.id] || attendanceData[s.id] === "come").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100/10 border border-red-300 rounded"></div>
            <span>ขาด: {studentsByClass.data.filter(s => attendanceData[s.id] === "absent").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100/10 border border-yellow-300 rounded"></div>
            <span>ลา: {studentsByClass.data.filter(s => attendanceData[s.id] === "leave").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100/10 border border-orange-300 rounded"></div>
            <span>ป่วย: {studentsByClass.data.filter(s => attendanceData[s.id] === "sick").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100/10 border border-blue-300 rounded"></div>
            <span>มาสาย: {studentsByClass.data.filter(s => attendanceData[s.id] === "late").length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveStudent;