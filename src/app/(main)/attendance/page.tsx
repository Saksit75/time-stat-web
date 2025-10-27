'use client'
import { Save, Eraser } from "lucide-react";
import AttendanceTable from "@/app/components/AttendanceTable";
import MyDatePicker from "@/app/components/MyDatePicker";
import Selecter from "@/app/components/Selecter";
import BackButton from "@/app/components/BackButton";
import { useState, useEffect, useCallback } from "react";
import Axios from "@/lib/axios";
import Swal from "sweetalert2";
import { useAppStore } from "@/store/appState";
import { AxiosResponse } from "axios";
import { AttendanceRow, FormApiResponse } from "@/types/attendance";
import Modal from "@/app/components/Modal";
import LeaveStudent from "@/app/components/LeaveStudent";

export default function Attendance() {

  type TeacherApi = {
    id: number;
    title_relation: { title_th: string } | null;
    first_name: string;
    last_name: string;
    class_level_relation: { class_level_th: string } | null;
  };
  type Teacher = {
    id: number;
    title: string;
    firstName: string;
    lastName: string;

  }
  type TeacherApiResponse = {
    success: boolean;
    data: TeacherApi[];
  };
  type ClassLevel = {
    id: number;
    classLevel: string
  }
  type ClassLevelApi = {
    id: number;
    class_level_th: string
  }
  type ClassLevelApiResponse = {
    success: boolean;
    data: ClassLevelApi[]
  }
  type studentsByClassType = {
    class_id: number;
    class_level_th: string;
    data: StudentData[];
  }
  type StudentData = {
    id: number;
    student_id: string;
    student_number: string;
    title: string;
    first_name: string;
    last_name: string;
    gender: string;
    detail: string
  }
  const isDark = useAppStore((state) => state.isDark);
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<studentsByClassType | null>(null);
  const [dataForm, setDataForm] = useState<FormApiResponse | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRow[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectClass, setSelectClass] = useState<number | null>(null);
  type AttendanceStatus = "present" | "absent" | "leave" | "sick" | "late";
  const [attendanceByClass, setAttendanceByClass] = useState<Record<number, Record<number, AttendanceStatus>>>({});
  const onOpenModal = (classId?: number) => {
    setIsModalOpen(true);
    if (classId !== undefined) {
      setSelectClass(classId)
      studentClassForm(classId)
    };
  };
  const onCloseModal = () => {
    setIsModalOpen(false);
  }

  const studentClassForm = async (classId: number = 0) => {
    try {
      const students = await Axios.get(`/students/class-level/${classId}`)
      setStudentsByClass(students.data.data)

    } catch (error) {
      setStudentsByClass(null);
    }
  }

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูล attendance ใน modal
  const handleModalAttendanceChange = useCallback((data: Record<number, AttendanceStatus>) => {
    if (selectClass !== null && studentsByClass) {
      // เก็บข้อมูล attendance ของ class นี้
      setAttendanceByClass(prev => ({
        ...prev,
        [studentsByClass.class_id]: data
      }));

      // คำนวณและอัปเดตข้อมูลใน attendanceData
      if (dataForm && dataForm.formData && studentsByClass) {
        const classData = Object.values(dataForm.formData).find((item: any) => item.class_level === selectClass);

        if (classData) {
          // คำนวณจำนวนนักเรียนในแต่ละสถานะ
          const comeMale = studentsByClass.data.filter(s => s.gender === 'm' && (!data[s.id] || data[s.id] === 'present')).length || 0;
          const comeFemale = studentsByClass.data.filter(s => s.gender === 'f' && (!data[s.id] || data[s.id] === 'present')).length || 0;
          const notComeMale = studentsByClass.data.filter(s => s.gender === 'm' && data[s.id] === 'absent').length || 0;
          const notComeFemale = studentsByClass.data.filter(s => s.gender === 'f' && data[s.id] === 'absent').length || 0;
          const absent = studentsByClass.data.filter(s => data[s.id] === 'absent').length || 0;
          const leave = studentsByClass.data.filter(s => data[s.id] === 'leave').length || 0;
          const sick = studentsByClass.data.filter(s => data[s.id] === 'sick').length || 0;
          const late = studentsByClass.data.filter(s => data[s.id] === 'late').length || 0;

          // อัปเดตข้อมูลใน attendanceData
          setAttendanceData(prev => {
            return prev.map(row => {
              if (row.id === selectClass) {
                return {
                  ...row,
                  comeMale,
                  comeFemale,
                  comeCount: comeMale + comeFemale,
                  notComeMale,
                  notComeFemale,
                  notComeCount: notComeMale + notComeFemale,
                  absent,
                  leave,
                  sick,
                  late
                };
              }
              return row;
            });
          });
        }
      }
    }
  }, [selectClass, studentsByClass, dataForm]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // ส่งข้อมูล attendance ไปยัง API
      const submitData = {
        date: dataForm?.date,
        teacherId: selectedTeacher,
        attendanceData: attendanceData
      };

      console.log("ข้อมูลที่จะส่ง:", submitData);

      // TODO: ส่งข้อมูลไปยัง API endpoint
      // const response = await Axios.post('/time-stat/save-attendance', submitData);

      Swal.fire({
        icon: 'success',
        title: 'บันทึกข้อมูลเรียบร้อย',
        theme: isDark ? 'dark' : 'light',
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error('Error saving attendance:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        theme: isDark ? 'dark' : 'light',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
      });
    }
  };

  const handleClear = () => {
    Swal.fire({
      icon: 'warning',
      title: 'ยืนยันการล้างข้อมูล',
      theme: isDark ? 'dark' : 'light',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด?',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ล้างข้อมูล',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        // รีเซ็ตข้อมูล attendance
        setAttendanceData([]);
        setSelectedTeacher("");

        Swal.fire({
          icon: 'success',
          title: 'ล้างข้อมูลเรียบร้อย',
          theme: isDark ? 'dark' : 'light',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };
  const handleAttendanceDataChange = useCallback((data: AttendanceRow[]) => {
    setAttendanceData(data);
  }, []);

  useEffect(() => {
    const getTeacherList = async () => {
      try {
        const resTeacherList: AxiosResponse<TeacherApiResponse> = await Axios.get('/teachers?status=in')
        setTeacherList(
          resTeacherList.data.data.map((teacher) => ({
            id: teacher.id,
            title: teacher.title_relation?.title_th || '',
            firstName: teacher.first_name,
            lastName: teacher.last_name,
          }))
        )
      } catch (error) {
        setTeacherList([])
      }
    }
    const getFormTimeStat = async () => {
      try {
        const resForm = await Axios.get('/time-stat/get-form-time-stat')
        console.log("FORM : ", resForm.data.data);

        setDataForm(resForm.data.data)
      } catch (error) {
        setDataForm(null)
      }
    }

    getTeacherList()
    getFormTimeStat()

  }, [])

  return (
    <div className="container mx-auto px-4 py-18 min-h-screen">
      <div>
        <BackButton />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-4xl font-black w-full text-center text-primary">
          ข้อมูลการมาเรียน
        </h1>
        <MyDatePicker
          initialDate={dataForm?.date}
          onDateChange={(date) => {
            // TODO: อัปเดตวันที่ใน API หรือ state
            console.log('Date changed:', date);
          }}
        />
        <AttendanceTable
          formData={dataForm}
          onDataChange={handleAttendanceDataChange}
          onOpenModal={onOpenModal}
        />
        <div className="flex items-center justify-center gap-3 w-full">
          <label htmlFor="teacher-select" className="whitespace-nowrap text-lg ">คุณครู : <span className="text-red-500">*</span></label>
          <Selecter
            id="teacher-select"
            value={selectedTeacher}
            onChange={(value) => setSelectedTeacher(value)}
            options={teacherList.map((teacher) => ({
              value: teacher.id.toString(),
              label: teacher.title + " " + teacher.firstName + " " + teacher.lastName
            }))}
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button type="submit" className="btn btn-primary !rounded-box">
            บันทึก <Save />
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-warning !rounded-box"
          >
            ล้าง <Eraser />
          </button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        title={studentsByClass?.class_level_th || ''}
      >
        {studentsByClass && (
          <LeaveStudent
            key={selectClass ?? 0}
            studentsByClass={studentsByClass ?? { class_id: 0, class_level_th: '', data: [] }}
            initialData={attendanceByClass[studentsByClass?.class_id ?? 0] || {}}
            onAttendanceChange={handleModalAttendanceChange}
          />
        )}
      </Modal>
    </div>
  );
}
