'use client';
import BackButton from "@/app/components/BackButton";
import Table from "@/app/components/Table";
import { Eye, Edit, Plus, ArrowUp10 } from "lucide-react";
import Link from "next/link";
import Axios from "@/lib/axios";
import { useEffect, useState } from "react";

// ✅ Type ของ student
type Student = {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  idCard: string;
  studentId: string;
  classLevel: string;
  gender: string;
  detail: string;
  status: string;
  photo: string;
  index: number;
}

// Type สำหรับ table header
type HeaderTable = {
  label: string;
  key: keyof Student;
  width?: string;
  align?: "left" | "center" | "right";
}

// ✅ ฟังก์ชัน map ข้อมูล student จาก API
const mapStudent = (student: any, idx: number): Student => ({
  index: idx+1,
  id: student.id,
  title: student.title_relation?.title_th || "-",   // ป้องกัน null
  firstName: student.first_name || "-",
  lastName: student.last_name || "-",
  studentNumber: student.student_number || "-",
  idCard: student.id_card || "-",
  studentId: student.student_id || "-",
  classLevel: student.class_level_relation?.class_level_th || "-",
  gender: student.gender || "-",
  detail: student.detail || "-",
  photo: student.photo || "",
  status: student.status === "in" ? "อยู่" : student.status === "out" ? "ออก" : "-",
});

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);

  // Table headers
  const headers: HeaderTable[] = [
    { label: "ลำดับ", key: "index", width: "5%" },
    { label: "เลขประชาชน", key: "idCard", width: "10%" },
    { label: "เลขประจำตัวนักเรียน", key: "studentId", width: "10%" },
    { label: "คำนำหน้า", key: "title", width: "10%" },
    { label: "ชื่อ", key: "firstName",align: "left" },
    { label: "สกุล", key: "lastName",align: "left" },
    { label: "ชั้น", key: "classLevel", width: "10%", align: "left" },
    { label: "เลขที่", key: "studentNumber", width: "7%" },
    { label: "สถานะ", key: "status", width: "7%" },
  ];

  // Map items สำหรับ table
  const items: Student[] = students.map(mapStudent);

  // ดึงข้อมูลนักเรียนจาก API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const resStudents = await Axios.get("/students");
        const studentData = resStudents.data?.data || [];
        setStudents(studentData);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col gap-2 min-h-screen">
      <div>
        <BackButton />
      </div>
      <h1 className="text-3xl font-bold text-center">รายชื่อนักเรียน</h1>
      <div className="flex items-center justify-end gap-2">
        <Link href="/students/up-level" className="btn btn-accent !rounded-box gap-2">
          <ArrowUp10 className="w-4 h-4" /> เลื่อนชั้น
        </Link>
        <Link href="/students/new" className="btn btn-primary !rounded-box gap-2">
          <Plus className="w-4 h-4" /> เพิ่ม
        </Link>
      </div>
      <Table
        headers={headers}
        items={items}
        actions={[
          {
            href: (item) => `/students/${item.id}`,
            label: "ดู",
            icon: () => <Eye className="w-4 h-4" />,
            btnSmall: true,
            btnClass: "btn-info",
          },
          {
            href: (item) => `/students/${item.id}/edit`,
            label: "แก้ไข",
            icon: () => <Edit className="w-4 h-4" />,
            btnSmall: true,
            btnClass: "btn-warning",
          },
        ]}
      />
    </div>
  );
};

export default Students;
