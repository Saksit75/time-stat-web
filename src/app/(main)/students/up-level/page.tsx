import BackButton from "@/app/components/BackButton"
import { CircleCheckBig, CircleX, CircleAlert } from "lucide-react"
import students from "@/data/students.json"

type HeaderTable = {
    label: string;
    key: string;
    width?: string;
}

const UpLevel = () => {
    const headers: HeaderTable[] = [
        { label: "ลำดับ", key: "index", width: "5%" },
        { label: "คำนำหน้า", key: "title", width: "10%" },
        { label: "ชื่อ", key: "firstName", width: "17%" },
        { label: "สกุล", key: "lastName", width: "17%" },
        { label: "ชั้น", key: "gradLevel", width: "10%" },
        { label: "เลขที่", key: "studentNumber", width: "6%" },
    ];
    return (
        <div className="container mx-auto px-4 py-20 flex flex-col gap-2 min-h-screen">
            <div className="flex items-center justify-between">
                <BackButton />
                <button className="btn btn-primary !rounded-box"><CircleCheckBig className="w-4 h-4" /> ยืนยันเลื่อนชั้นนักเรียน</button>
            </div>
            <div className="flex flex-col p-4 gap-4 w-full">
                <label className="input !rounded-box  w-full">
                    <input type="text" className="grow" placeholder="ค้นหานักเรียน" />
                    <CircleX className="w-4 h-4" />
                </label>
                <div className="flex flex-col items-center gap-2 w-full">
                    <div className="overflow-x-auto w-full">
                        <table className="table-auto border-collapse w-full">
                            <thead className="bg-info sticky top-0 z-30">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">ลำดับ</th>
                                    <th className="border border-gray-300 px-4 py-2">คำนำหน้า</th>
                                    <th className="border border-gray-300 px-4 py-2">ชื่อ</th>
                                    <th className="border border-gray-300 px-4 py-2">สกุล</th>
                                    <th className="border border-gray-300 px-4 py-2">ชั้น</th>
                                    <th className="border border-gray-300 px-4 py-2">เลขที่</th>
                                        
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    students.map((student, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2">{student.title}</td>
                                            <td className="border border-gray-300 px-4 py-2">{student.firstName}</td>
                                            <td className="border border-gray-300 px-4 py-2">{student.lastName}</td>
                                            <td className="border border-gray-300 px-4 py-2">{student.gradLevel}</td>
                                            <td className="border border-gray-300 px-4 py-2">{student.studentNumber}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"> <CircleAlert /> ไม่มีนักเรียนยกเว้นการเลื่อนชั้น</h1>
                </div>
            </div>
        </div>
    )
}
export default UpLevel