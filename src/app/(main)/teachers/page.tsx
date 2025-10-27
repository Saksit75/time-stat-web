'use client';
import BackButton from "@/app/components/BackButton";
import Table from "@/app/components/Table";
import { Eye, Edit, Trash, Plus, User2 } from "lucide-react";
import Link from "next/link";
import Axios from "@/lib/axios";
import { useEffect, useState } from "react";

type Teacher = {
    index: number;
    teacher_id: number;
    title: string;
    firstName: string;
    lastName: string;
    status: string;
};
const mapTeacher = (teacher: any, idx: number): Teacher => ({
  index: idx + 1, 
  teacher_id: teacher.id,
  title: String(teacher.title_relation.title_th),
  firstName: teacher.first_name,
  lastName: teacher.last_name,
  status: teacher.status === "in" ? "อยู่" : teacher.status === "out" ? "ออก" : "-",
});
type HeaderTable = {
  label: string;
  key: keyof Teacher;
  width?: string;
  align?: "left" | "center" | "right";
}

const Teachers =  () => {
  const [teacherList, setTeacherList] = useState<Array<{ id: number; title: string; firstName: string; lastName: string }>>([]);

 
  
  const headers: HeaderTable[] = [
    { label: "ลำดับ", key: "index", width: "5%" },
    { label: "คำนำหน้า", key: "title", width: "10%", align: "center" },
    { label: "ชื่อ", key: "firstName", width: "auto", align: "left" },
    { label: "สกุล", key: "lastName", width: "auto", align: "left" },
    { label: "สถานะ", key: "status", width: "10%" },
  ];

  const items: Teacher[] = teacherList.map(mapTeacher);
    
  useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await Axios.get("/teachers");
                setTeacherList(res.data.data);
                
            } catch (error) {
                setTeacherList([]);
            }
        };
        fetchTeachers();
    }, []);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col gap-2 min-h-screen">
      <div>
        <BackButton />
      </div>
      <h1 className="text-3xl font-bold text-center">รายชื่อบุคลากร</h1>
      <div className="text-end">
        <Link href="/teachers/new" className="btn btn-primary !rounded-box gap-2"> <Plus className="w-4 h-4" /> เพิ่ม</Link>
      </div>
      <Table
      itemsPerPageOptions={[10, 20,50,100,200,500]}
        headers={headers}
        items={items}
        actions={[
          // {
          //   onClick: (item) => alert("สถานะ: " + item.firstName),
          //   label: "สถานะ",
          //   icon: () => <User2 className="w-4 h-4" />,
          //               btnSmall: true,
          //   btnClass: "btn-accent",
          // },
          {
             href: (item) => `/teachers/${item.teacher_id}`,

            label: "ดู",
            icon: () => <Eye className="w-4 h-4" />,
            btnSmall: true,
            btnClass: "btn-info",
          },
          {
            href: (item) => `/teachers/${item.teacher_id}/edit`,
            label: "แก้ไข",
            icon: () => <Edit className="w-4 h-4" />,
            btnSmall: true,
            btnClass: "btn-warning",
          },
          //  {
          //   onClick: (item) => alert("ลบ: " + item.firstName),
          //   label: "ลบ",
          //   icon: () => <Trash className="w-4 h-4" />,
          //               btnSmall: true,
          //   btnClass: "btn-error",
          // }
        ]}
      /> 
    </div>
  );
};

export default Teachers;