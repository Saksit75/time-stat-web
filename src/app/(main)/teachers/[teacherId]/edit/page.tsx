'use client';
import BackButton from "@/app/components/BackButton";
import { useEffect, useState } from "react";
import { User, FileText, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import Axios from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";
import { useAppStore } from "@/store/appState";

const TeacherEdit = () => {
    const router = useRouter();
    const { teacherId } = useParams();
    const isDark = useAppStore((state) => state.isDark);

    const [showPassword, setShowPassword] = useState(false);
    const [titleList, setTitleList] = useState<any[]>([]);
    const [classLevelList, setClassLevelList] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        gradeLevel: "",
        subject: "",
        phoneNumber: "",
        idCard: "",
        username: "",
        password: "",
        confirmPassword: "",
        detail: "",
        teacher_status: "in",
        photo: null as File | null,
        gender: "",
        role: "",
        status: "",
    });
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    // ✅ ดึงข้อมูลครูมาเติมในฟอร์ม
    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const resTeacher = await Axios.get(`/teachers/${teacherId}`);
                const TeacherData = resTeacher.data.data;
                const teacherPhoto = TeacherData.photo
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${TeacherData.photo.replace(/\\/g, '/')}`
                    : null;
                setFormData({
                    title: TeacherData.title_relation?.id || "",
                    firstName: TeacherData.first_name || "",
                    lastName: TeacherData.last_name || "",
                    gradeLevel: TeacherData.class_level_relation?.id || "",
                    subject: TeacherData.subject || "",
                    phoneNumber: TeacherData.phone || "",
                    idCard: TeacherData.id_card || "",
                    username: TeacherData.username || "",
                    password: "",
                    confirmPassword: "",
                    detail: TeacherData.detail || "",
                    teacher_status: TeacherData.status || "in",
                    photo: null,
                    gender: TeacherData.gender || "",
                    role: TeacherData.role || "",
                    status: TeacherData.status || "",
                });
                setPhotoUrl(teacherPhoto || null);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "ไม่พบข้อมูล",
                    text: "ไม่สามารถโหลดข้อมูลครูได้",
                    theme: isDark ? "dark" : "light",
                }).then(() => router.push("/teachers"));
            }
        };
        fetchTeacher();
    }, [teacherId]);

    // ✅ โหลดคำนำหน้า
    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const res = await Axios.get("/name-title");
                setTitleList(res.data.data);
            } catch {
                setTitleList([]);
            }
        };
        fetchTitles();
    }, []);

    // ✅ โหลดระดับชั้น
    useEffect(() => {
        const fetchClassLevels = async () => {
            try {
                const res = await Axios.get("/class-level");
                setClassLevelList(res.data.data);
            } catch {
                setClassLevelList([]);
            }
        };
        fetchClassLevels();
    }, []);

    // ✅ handle change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
    };

    const statusColor = (status: string) => {
        switch (status) {
            case "in": return "bg-green-500 text-white";
            case "out": return "bg-red-500 text-white";
            default: return "bg-gray-300 text-black";
        }
    };

    // ✅ ส่งข้อมูล (PUT)
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

        if (formData.password && !formData.username) {
            Swal.fire({
                icon: "error",
                title: "กรุณากรอก Username",
                text: "เนื่องจากคุณใส่รหัสผ่าน จึงต้องกรอก Username ด้วย",
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "รหัสผ่านไม่ตรงกัน",
                text: "โปรดตรวจสอบ Password และ Confirm Password",
            });
            return;
        }

        const data = new FormData();
        data.append("title", String(formData.title));
        data.append("first_name", formData.firstName);
        data.append("last_name", formData.lastName);
        data.append("class_level", String(formData.gradeLevel));
        data.append("subject", formData.subject);
        data.append("phone", formData.phoneNumber);
        data.append("id_card", formData.idCard);
        data.append("username", formData.username);
        if (formData.password) data.append("password", formData.password);
        data.append("detail", formData.detail);
        data.append("role", formData.role);
        data.append("gender", formData.gender?.toLowerCase());
        data.append("status", formData.teacher_status);

        if (formData.photo instanceof File) {
            data.append("photo", formData.photo);
        }
        try {
            const res = await Axios.put(`/teachers/${teacherId}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "บันทึกสำเร็จ",
                    text: "ข้อมูลครูถูกอัปเดตเรียบร้อยแล้ว",
                    theme: isDark ? "dark" : "light",
                }).then(() => router.push("/teachers"));
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

    return (
        <div className="container mx-auto px-4 py-18 min-h-screen flex flex-col gap-6">
            <div className="flex">
                <BackButton />
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col bg-base-100 rounded-lg shadow-xl overflow-hidden w-full max-w-3xl mx-auto"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-6 flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <User className="w-8 h-8" />
                        แก้ไขข้อมูลบุคลากร
                    </h1>
                    <p className="text-white/80">ปรับปรุงข้อมูลบุคลากร</p>
                </div>

                {/* ฟอร์ม */}
                <div className="p-8 flex flex-col gap-8 bg-base-300">
                    {/* รูปภาพ */}
                    <div className="flex flex-col items-center gap-2">
                        <label htmlFor="teacherPhoto" className="w-40 h-40 border rounded overflow-hidden bg-base-100 flex items-center justify-center cursor-pointer">
                            {formData.photo ? (
                                <img src={URL.createObjectURL(formData.photo)} alt="photo" className="w-full h-full object-cover" />
                            ) : photoUrl ? (
                                <img src={photoUrl} alt="รูปภาพบุคลากร" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-sm">เลือกรูปใหม่</span>
                            )}
                        </label>
                        <input type="file" id="teacherPhoto" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </div>
                    {/* ข้อมูลส่วนตัว */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                                <User className="w-5 h-5" /> ข้อมูลส่วนตัว
                            </h2>
                            <select
                                name="status"
                                value={formData.teacher_status}
                                //({...สำเนา formData, เข้าไปแก้ไขเฉพาะ teacher_status: e.target.value as string,ค่าอื่น,ค่าอื่น})
                                onChange={(e) => setFormData(prev => ({ ...prev, teacher_status: e.target.value as string }))}
                                className={`inline-block px-3 py-1 rounded-full font-medium ${statusColor(formData.teacher_status)}`}
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
                                    {titleList.map(title => (
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

                    {/* ข้อมูลการทำงาน/ตำแหน่ง */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                                <User className="w-5 h-5" /> ข้อมูลการทำงาน
                            </h2>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                                <span className="font-semibold">ประจำชั้น <span className="text-red-500">*</span></span>
                                <select
                                    name="gradeLevel"
                                    value={formData.gradeLevel}
                                    onChange={handleChange}
                                    className="bg-base-100 p-2 rounded border w-full"
                                    required
                                >
                                    <option value="">เลือก</option>
                                    {classLevelList.map(level => (
                                        <option key={level.id} value={level.id}>
                                            {level.class_level_th}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1 flex flex-col gap-2">
                                <span className="font-semibold">ประจำวิชา <span className="text-red-500">*</span></span>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="bg-base-100 p-2 rounded border w-full"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* ข้อมูลติดต่อ */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                                <span className="font-semibold">เบอร์โทร</span>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="bg-base-100 p-2 rounded border w-full"
                                />
                            </div>

                            <div className="flex-1 flex flex-col gap-2">
                                <span className="font-semibold">บัตรประชาชน</span>
                                <input
                                    type="text"
                                    name="idCard"
                                    value={formData.idCard}
                                    onChange={handleChange}
                                    className="bg-base-100 p-2 rounded border w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ข้อมูล Account */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                                <span className="font-semibold">
                                    Username
                                    {formData.password && <span className="text-red-500"> *</span>}
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="bg-base-100 p-2 rounded border w-full"
                                    required={!!formData.password}
                                    disabled={!!formData.username}
                                />
                            </div>

                            <div className="flex-1 flex flex-col gap-2">
                                <span className="font-semibold">Role <span className="text-red-500">*</span></span>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="bg-base-100 p-2 rounded border w-full"
                                    required
                                >
                                    <option value="">เลือก</option>
                                    <option value="g">ทั่วไป</option>
                                    <option value="a">แอดมิน</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex flex-col gap-2">
                            <span className="font-semibold">Password</span>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-base-100 p-2 rounded border w-full pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            <span className="font-semibold">Confirm Password {formData.password && <span className="text-red-500"> *</span>}</span>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="bg-base-100 p-2 rounded border w-full pr-10"
                                    required={!!formData.password} //!! (double bang) เป็น  JavaScript ที่ใช้เพื่อแปลงค่าหนึ่ง ๆ ให้กลายเป็น boolean (true/false)
                                    disabled={!formData.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
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
                        <Link href="/teachers" className="btn flex-1 !rounded-box">
                            ยกเลิก
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 !rounded-box"
                        >
                            บันทึกข้อมูล
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TeacherEdit;
