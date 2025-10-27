'use client'
import AttendaceSum from "@/app/components/AttendaceSum"
import AttendanceInfo from "@/app/components/AttendanceInfo"
import AttendanceStudents from "@/app/components/AttendanceStudents"
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
        <h1 className="text-2xl md:text-3xl font-bold">รายงานข้อมูลการมาเรียน</h1>
      </div>
      <div className="flex flex-col py-4 gap-4 w-full">
        <MonthRangeSearch onSearch={handleSearch} onClear={handleClear} />
        <div className="flex flex-col py-4 gap-4 bg-base-200 rounded-lg shadow-md p-6 md:p-8 w-full">
          {/* name of each tab group should be unique */}
          <div className="tabs tabs-box">
            <input type="radio" name="my_tabs_6" className="tab" aria-label="สรุปการมาเรียน"  defaultChecked/>
            <div className="tab-content bg-base-100 border-base-300 p-6"><AttendaceSum /></div>

            <input type="radio" name="my_tabs_6" className="tab" aria-label="เวลาเรียนของนักเรียน" />
            <div className="tab-content bg-base-100 border-base-300 p-6"><AttendanceStudents /></div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AttendanceReport