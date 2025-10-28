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
  // ---------- 🧩 TYPES ----------
  type AttendanceStatus = "come" | "absent" | "leave" | "sick" | "late";

  type StudentData = {
    id: number;
    student_id: string;
    student_number: string;
    title: string;
    first_name: string;
    last_name: string;
    gender: "m" | "f" | string;
    detail?: string;
    class_status?: AttendanceStatus;
  };

  type StudentsByClassType = {
    class_id: number;
    class_level_th: string;
    data: StudentData[];
    remark: StudentData[];
    absent?: number;
    leave?: number;
    sick?: number;
    late?: number;
    come_male?: number;
    come_female?: number;
    come_count?: number;
    not_come_male?: number;
    not_come_female?: number;
    not_come_count?: number;
    amount_male?: number;
    amount_female?: number;
    amount_count?: number;
  };

  type TempDataFormType = FormApiResponse | null;

  // ---------- ⚙️ STATES ----------
  const isDark = useAppStore((state) => state.isDark);
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<StudentsByClassType | null>(null);
  const [dataForm, setDataForm] = useState<FormApiResponse | null>(null);
  const [tempDataForm, setTempDataForm] = useState<TempDataFormType>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRow[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectClass, setSelectClass] = useState<number | null>(null);

  // ---------- 🧠 FUNCTIONS ----------
  const onOpenModal = (classId?: number) => {
    setIsModalOpen(true);
    if (classId !== undefined && dataForm) {
      setSelectClass(classId);
      setTempDataForm(dataForm);

      const classData: any = dataForm.formData[classId.toString()];
      if (classData) setStudentsByClass(classData);
    }
  };

  const onCloseModal = (saveChanges: boolean) => {
    if (saveChanges && tempDataForm && selectClass !== null) {
      const classKey = selectClass.toString();
      const updatedClassData: any = tempDataForm.formData[classKey];

      if (updatedClassData) {
        setDataForm(prev => {
          if (!prev) return { ...tempDataForm };
          const newFormData = { ...prev.formData, [classKey]: updatedClassData };
          return { ...prev, formData: newFormData };
        });

        setStudentsByClass(updatedClassData);
        console.log("✅ Committed updated classData:", updatedClassData);
      }
    }

    setIsModalOpen(false);
    setTempDataForm(null);
  };

  useEffect(() => {
    if (selectClass !== null && dataForm?.formData) {
      const classData: any = dataForm.formData[selectClass.toString()];
      if (classData) setStudentsByClass(classData);
    }
  }, [dataForm, selectClass]);

  const onSelectLeave = (
    studentId: number,
    gender: string,
    status: AttendanceStatus,
    newAttendanceMap: Record<number, AttendanceStatus>
  ) => {
    if (!tempDataForm || selectClass === null) return;

    const classId = selectClass;
    setTempDataForm(prev => {
      if (!prev) return null;

      const newFormData = { ...prev.formData };
      const classKey = classId.toString();
      const classData = { ...newFormData[classKey] };

      // อัปเดตสถานะของนักเรียนใน remark
      classData.remark = (classData.remark || []).map((s: StudentData) =>
        s.id === studentId ? { ...s, class_status: status } : s
      );

      // เริ่มนับค่าใหม่
      let absentMale = 0, absentFemale = 0;
      let leaveMale = 0, leaveFemale = 0;
      let sickMale = 0, sickFemale = 0;
      let lateMale = 0, lateFemale = 0;

      classData.remark.forEach((s: StudentData) => {
        switch (s.class_status) {
          case 'absent': s.gender === 'm' ? absentMale++ : absentFemale++; break;
          case 'leave': s.gender === 'm' ? leaveMale++ : leaveFemale++; break;
          case 'sick': s.gender === 'm' ? sickMale++ : sickFemale++; break;
          case 'late': s.gender === 'm' ? lateMale++ : lateFemale++; break;
        }
      });

      classData.absent = absentMale + absentFemale;
      classData.leave = leaveMale + leaveFemale;
      classData.sick = sickMale + sickFemale;
      classData.late = lateMale + lateFemale;

      const totalMale = classData.amount_male || 0;
      const totalFemale = classData.amount_female || 0;
      const totalCount = classData.amount_count || 0;

      const notComeMale = absentMale + leaveMale + sickMale;
      const notComeFemale = absentFemale + leaveFemale + sickFemale;
      const notComeCount = notComeMale + notComeFemale;

      classData.not_come_male = notComeMale;
      classData.not_come_female = notComeFemale;
      classData.not_come_count = notComeCount;

      classData.come_male = totalMale - notComeMale;
      classData.come_female = totalFemale - notComeFemale;
      classData.come_count = totalCount - notComeCount;

      newFormData[classKey] = classData;
      console.log("✅ classData updated =", classData);

      return { ...prev, formData: newFormData };
    });
  };

  useEffect(() => {
    console.log("🟢 tempDataForm updated:", tempDataForm);
  }, [tempDataForm]);

  useEffect(() => {
    console.log("🟢 dataForm updated:", dataForm);
  }, [dataForm]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedTeacher || attendanceData.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        theme: isDark ? 'dark' : 'light',
        text: 'กรุณาเลือกคุณครูและตรวจสอบข้อมูลการมาเรียน',
      });
      return;
    }

    try {
      const submitData = {
        date: dataForm?.date,
        teacherId: selectedTeacher,
        attendanceData
      };
      console.log("ส่งข้อมูล:", submitData);

      Swal.fire({
        icon: 'success',
        title: 'บันทึกข้อมูลเรียบร้อย',
        theme: isDark ? 'dark' : 'light',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        theme: isDark ? 'dark' : 'light',
        text: 'ไม่สามารถบันทึกข้อมูลได้'
      });
    }
  };

  const handleClear = async () => {
    await Swal.fire({
      icon: 'warning',
      title: 'ยืนยันการล้างข้อมูล',
      theme: isDark ? 'dark' : 'light',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด?',
      showCancelButton: true,
      confirmButtonText: 'ใช่ ล้างข้อมูล',
      cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await getFormTimeStat();
          if (res) setTempDataForm(null);
          Swal.fire({
            icon: 'success',
            title: 'ล้างข้อมูลเรียบร้อย',
            theme: isDark ? 'dark' : 'light',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error clearing attendance data:', error);
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            theme: isDark ? 'dark' : 'light',
            timer: 1500,
            showConfirmButton: false
          });
        }
      }
    });
  };

  const handleAttendanceDataChange = useCallback((data: AttendanceRow[]) => setAttendanceData(data), []);

  const getTeacherList = async () => {
    try {
      const res: AxiosResponse<any> = await Axios.get('/teachers?status=in');
      setTeacherList(res.data.data.map((t: any) => ({
        id: t.id,
        title: t.title_relation?.title_th || '',
        firstName: t.first_name,
        lastName: t.last_name
      })));
    } catch {
      setTeacherList([]);
    }
  };

  const getFormTimeStat = async () => {
    try {
      const res = await Axios.get('/time-stat/get-form-time-stat');
      setDataForm(res.data.data);
      return true;
    } catch {
      setDataForm(null);
    }
  };

  useEffect(() => {
    getTeacherList();
    getFormTimeStat();
  }, []);

  // ---------- 🧩 RENDER ----------
  return (
    <div className="container mx-auto px-4 py-18 min-h-screen">
      <BackButton />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-4xl font-black w-full text-center text-primary">ข้อมูลการมาเรียน</h1>

        <MyDatePicker
          initialDate={dataForm?.date}
          onDateChange={(date) =>
            setDataForm((prev: any) => (prev ? { ...prev, date } : { date }))
          }
        />


        <AttendanceTable
          formData={dataForm}
          onDataChange={handleAttendanceDataChange}
          onOpenModal={onOpenModal}
        />

        <div className="flex items-center justify-center gap-3 w-full">
          <label htmlFor="teacher-select" className="whitespace-nowrap text-lg">
            คุณครู : <span className="text-red-500">*</span>
          </label>
          <Selecter
            id="teacher-select"
            value={selectedTeacher}
            onChange={setSelectedTeacher}
            options={teacherList.map(t => ({
              value: t.id.toString(),
              label: `${t.title} ${t.firstName} ${t.lastName}`
            }))}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="submit" className="btn btn-primary !rounded-box">
            บันทึก <Save />
          </button>
          <button type="button" onClick={handleClear} className="btn btn-warning !rounded-box">
            ล้าง <Eraser />
          </button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => onCloseModal(true)}
        title={studentsByClass?.class_level_th || 'บันทึกการมาเรียนรายบุคคล'}
      >
        {studentsByClass && tempDataForm && (
          <LeaveStudent
            classLevelName={studentsByClass.class_level_th}
            students={studentsByClass.remark}
            onSelectLeave={onSelectLeave}
          />
        )}
      </Modal>
    </div>
  );
}