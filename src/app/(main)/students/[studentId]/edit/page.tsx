'use client';
import BackButton from "@/app/components/BackButton";
import { useState, useEffect } from "react";
import { User, FileText } from "lucide-react";
import Axios from "@/lib/axios";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appState";
const StudentEdit = () => {
    const isDark = useAppStore((state) => state.isDark);
    const params = useParams();
    const router = useRouter();
    const studentId = params.studentId;
    const [titleList, setTitleList] = useState<any[]>([]);
    const [classLevelList, setClassLevelList] = useState<any[]>([]);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        gender: "",
        idCard: "",
        studentId: "",
        classLevel: "",
        studentNumber: "",
        detail: "",
        status: "",
        photo: null as File | null,
    });
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
    // ✅ ดึงข้อมูลครูมาเติมในฟอร์ม
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const resStudent = await Axios.get(`/students/${studentId}`);
                const studentData = resStudent.data.data;
                const studentPhoto = studentData.photo
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${studentData.photo.replace(/\\/g, '/')}`
                    : null;
                setFormData({
                    title: studentData.title_relation?.id || "",
                    firstName: studentData.first_name || "",
                    lastName: studentData.last_name || "",
                    gender: studentData.gender || "",
                    idCard: studentData.id_card || "",
                    studentId: studentData.student_id || "",
                    classLevel: studentData.class_level_relation?.id || "",
                    studentNumber: studentData.student_number || "",
                    detail: studentData.detail || "",
                    status: studentData.status || "",
                    photo: null,
                });
                setPhotoUrl(studentPhoto || null);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "ไม่พบข้อมูล",
                    text: "ไม่สามารถโหลดข้อมูลครูได้",
                    theme: isDark ? "dark" : "light",
                }).then(() => router.push("/students"));
            }
        };
        fetchStudent();
    }, [studentId]);
    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const res = await Axios.get("/name-title");
                setTitleList(res.data.data);
            } catch {
                setTitleList([]);
            }
        };
        const fetchClassLevels = async () => {
            try {
                const res = await Axios.get("/class-level");
                setClassLevelList(res.data.data);
            } catch {
                setClassLevelList([]);
            }
        };
        fetchTitles();
        fetchClassLevels();
    }, [])
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const idCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, "");
        if (numericValue.length <= 13) {
            setFormData((prev) => ({ ...prev, idCard: numericValue }));
        } else {
            Toast.fire({
                icon: 'warning',
                title: 'เลขบัตรประชาชนไม่เกิน 13 ตัว',
                theme: isDark ? "dark" : "light",
            })
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

        if (!allowedTypes.includes(file.type)) {
            Swal.fire({
                icon: "error",
                title: "ไฟล์ไม่ถูกต้อง",
                text: "กรุณาเลือกไฟล์รูปภาพที่เป็น JPEG, JPG, PNG หรือ GIF เท่านั้น",
            });
            e.target.value = ""; // reset input
            return;
        }

        // ถ้าไฟล์ถูกต้อง → เก็บไว้ใน state
        setFormData(prev => ({ ...prev, photo: file }));
    };;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await Swal.fire({
            title: "ยืนยันการแก้ไขข้อมูล",
            text: "คุณแน่ใจหรือไม่ว่าต้องการแก้ไขข้อมูลนี้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            theme: isDark ? "dark" : "light",
        });

        if (!result.isConfirmed) {
            return;
        }

        const data = new FormData();
        data.append("status", formData.status?.toLowerCase());
        data.append("title", String(formData.title));
        data.append("first_name", formData.firstName);
        data.append("last_name", formData.lastName);
        data.append("gender", formData.gender?.toLowerCase());
        data.append("id_card", formData.idCard);
        data.append("student_id", formData.studentId);
        data.append("class_level", String(formData.classLevel));
        data.append("student_number", formData.studentNumber);
        data.append("detail", formData.detail);

        if (formData.photo instanceof File) {
            data.append("photo", formData.photo);
        }
        try {
            const res = await Axios.put(`/students/${studentId}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "บันทึกสำเร็จ",
                    text: "ข้อมูลครูถูกอัปเดตเรียบร้อยแล้ว",
                    theme: isDark ? "dark" : "light",
                }).then(() => router.push("/students"));
            }
        } catch (err: any) {
            console.error(err.response?.data || err);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: err.response?.data?.message || "ไม่สามารถอัปเดตข้อมูลได้",
                theme: isDark ? "dark" : "light",
            });
        }
    };


    const statusColor = (status: string) => {
        switch (status) {
            case "in": return "bg-green-500 text-white";
            case "out": return "bg-red-500 text-white";
            default: return "bg-gray-300 text-black";
        }
    };

    return (
        <div className="container mx-auto px-4 py-18 min-h-screen flex flex-col gap-6">
            <div className="flex">
                <BackButton />
            </div>

            <div className="flex flex-col items-center gap-2 justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col bg-base-100 rounded-lg shadow-xl overflow-hidden w-full max-w-3xl"
                >
                    {/* Title Bar */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <User className="w-8 h-8" />
                            แก้ไขข้อมูลนักเรียน
                        </h1>
                        <p className="text-white/80">แก้ไขข้อมูลนักเรียนใหม่</p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 flex flex-col gap-8 bg-base-300">

                        {/* รูปนักเรียน */}
                        <div className="flex flex-col items-center gap-2">
                            <label htmlFor="studentPhoto" className="w-40 h-40 border rounded overflow-hidden bg-base-100 flex items-center justify-center cursor-pointer">
                                {formData.photo ? (
                                    <img src={URL.createObjectURL(formData.photo)} alt="photo" className="w-full h-full object-cover" />
                                ) : photoUrl ? (
                                    <img src={photoUrl} alt="รูปภาพบุคลากร" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-sm">เลือกรูปใหม่</span>
                                )}
                            </label>
                            <input type="file" id="studentPhoto" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </div>

                        {/* ข้อมูลส่วนตัว */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                                    <User className="w-5 h-5" /> ข้อมูลนักเรียน
                                </h2>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={`inline-block px-3 py-1 rounded-full font-medium ${statusColor(formData.status)}`}
                                >
                                    <option value="in" className="bg-base-100 text-black dark:text-white">อยู่</option>
                                    <option value="out" className="bg-base-100 text-black dark:text-white">ออก</option>
                                </select>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-2">
                                    <span className="font-semibold">คำนำหน้า <span className="text-red-500">*</span></span>
                                    <select
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="bg-base-100 p-2 rounded border w-full"
                                        required
                                    >
                                        <option value="">เลือก</option>
                                        {titleList && titleList.map((title) => (
                                            <option key={title.id} value={title.id}>
                                                {title.title_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <span className="font-semibold">ชื่อ <span className="text-red-500">*</span></span>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="bg-base-100 p-2 rounded border w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-2">
                                    <span className="font-semibold">นามสกุล <span className="text-red-500">*</span></span>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="bg-base-100 p-2 rounded border w-full"
                                        required
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <span className="font-semibold">เพศ <span className="text-red-500">*</span></span>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="bg-base-100 p-2 rounded border w-full"
                                        required
                                    >
                                        <option value="">เลือก</option>
                                        <option value="m">ชาย</option>
                                        <option value="f">หญิง</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-2">
                                    <span className="font-semibold">เลขประชาชน <span className="text-red-500">*</span></span>
                                    <input
                                        type="text"
                                        name="idCard"
                                        value={formData.idCard}
                                        onChange={idCardChange}
                                        className="bg-base-100 p-2 rounded border w-full"
                                        min={1}
                                        required
                                    />
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <span className="font-semibold">เลขประจำตัวนักเรียน <span className="text-red-500">*</span></span>
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        className="bg-base-100 p-2 rounded border w-full"
                                        min={1}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ข้อมูลการศึกษา */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-2">
                                    <span className="font-semibold">ชั้นเรียน <span className="text-red-500">*</span></span>
                                    <select
                                        name="classLevel"
                                        value={formData.classLevel}
                                        onChange={handleChange}
                                        className="bg-base-100 p-2 rounded border w-full"
                                        required
                                    >
                                        <option value="">เลือก</option>
                                        {classLevelList && classLevelList.map((classLevel) => (
                                            <option key={classLevel.id} value={classLevel.id}>
                                                {classLevel.class_level_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <span className="font-semibold">เลขที่ <span className="text-red-500">*</span></span>
                                    <input
                                        type="number"
                                        name="studentNumber"
                                        value={formData.studentNumber}
                                        onChange={handleChange}
                                        className="bg-base-100 p-2 rounded border w-full"
                                        min={1}
                                        required
                                    />
                                </div>
                            </div>
                        </div>


                        {/* รายละเอียดเพิ่มเติม */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <FileText className="w-5 h-5" /> รายละเอียดเพิ่มเติม
                            </h2>
                            <textarea
                                name="detail"
                                value={formData.detail}
                                onChange={handleChange}
                                className="bg-base-100 p-4 rounded border w-full resize-none min-h-[100px]"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                className="btn flex-1 !rounded-box"
                                onClick={() => window.history.back()}
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex-1 !rounded-box"
                            >
                                บันทึกข้อมูล
                            </button>
                        </div>

                    </div>
                </form>

                {/* Helper Text */}
                <div className="flex justify-center text-sm text-gray-500">
                    <span className="text-red-500">*</span> ระบุข้อมูลที่จำเป็นต้องกรอก
                </div>
            </div>
        </div>
    );
};

export default StudentEdit;
