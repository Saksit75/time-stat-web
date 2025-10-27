'use client'
import AttendanceInfo from "@/app/components/AttendanceInfo"
import BackButton from "@/app/components/BackButton"
import MonthRangeSearch from "@/app/components/MonthRangeSearch"

const AttendanceReport = () => {
    const handleSearch = (data: {
        startMonth: string
        startYear: string
        endMonth: string
        endYear: string
    }) => {
        console.log("Search data:", data)
        // ทำการค้นหาข้อมูลตามช่วงเวลาที่เลือก
    }

    const handleClear = () => {
        console.log("Cleared")
        // ล้างข้อมูลที่แสดงผล (ถ้ามี)
    }
    return (
        <div className="container mx-auto px-4 py-18 min-h-screen">
            <div className="flex items-center gap-4">
                <BackButton />
            </div>
            <div className="flex items-center justify-center w-full">
                <h1 className="text-2xl md:text-3xl font-bold">ประวัติข้อมูลการมาเรียน</h1>
            </div>
            <div className="flex flex-col py-4 gap-4 w-full">
                <MonthRangeSearch onSearch={handleSearch} onClear={handleClear} />
                <div className="flex flex-col py-4 gap-4 bg-base-200 rounded-lg shadow-md p-6 md:p-8 w-full">
                    <AttendanceInfo />
                </div>
            </div>

        </div>
    )
}

export default AttendanceReport