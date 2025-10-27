'use client'
import { useState } from "react"

interface DateRangeSelectorProps {
  onSearch?: (data: {
    startMonth: string
    startYear: string
    endMonth: string
    endYear: string
  }) => void
  onClear?: () => void
}

const MonthRangeSearch: React.FC<DateRangeSelectorProps> = ({ onSearch, onClear }) => {
  const monthList = [
    { id: 1, name: "มกราคม" },
    { id: 2, name: "กุมภาพันธ์" },
    { id: 3, name: "มีนาคม" },
    { id: 4, name: "เมษายน" },
    { id: 5, name: "พฤษภาคม" },
    { id: 6, name: "มิถุนายน" },
    { id: 7, name: "กรกฎาคม" },
    { id: 8, name: "สิงหาคม" },
    { id: 9, name: "กันยายน" },
    { id: 10, name: "ตุลาคม" },
    { id: 11, name: "พฤศจิกายน" },
    { id: 12, name: "ธันวาคม" },
  ]

  const [startMonth, setStartMonth] = useState("")
  const [startYear, setStartYear] = useState("")
  const [endMonth, setEndMonth] = useState("")
  const [endYear, setEndYear] = useState("")

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ startMonth, startYear, endMonth, endYear })
    }
  }

  const handleClear = () => {
    setStartMonth("")
    setStartYear("")
    setEndMonth("")
    setEndYear("")
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className="bg-base-200 rounded-lg shadow-md p-6 md:p-8 w-full">
      <h2 className="text-lg md:text-xl font-semibold  mb-6">เลือกช่วงเวลา</h2>

      {/* Form Layout */}
      <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:items-end">
        {/* Start Month */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="start-month" className="text-sm font-medium ">
            เดือนเริ่มต้น
          </label>
          <select
            id="start-month"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className="select w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          >
            <option value="" disabled>เลือกเดือน</option>
            {monthList.map((month) => (
              <option key={month.id} value={month.id}>
                {month.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Year */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="start-year" className="text-sm font-medium ">
            ปีเริ่มต้น
          </label>
          <input
            id="start-year"
            type="number"
            placeholder="2568"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="input w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center md:pb-2">
          <div className="flex items-center w-full md:w-auto">
            <div className="h-px bg-gray-300 flex-1 md:hidden"></div>
            <span className="px-4 font-medium">ถึง</span>
            <div className="h-px bg-gray-300 flex-1 md:hidden"></div>
          </div>
        </div>

        {/* End Month */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="end-month" className="text-sm font-medium ">
            เดือนสิ้นสุด
          </label>
          <select
            id="end-month"
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            className="select w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          >
            <option value="" disabled>เลือกเดือน</option>
            {monthList.map((month) => (
              <option key={month.id} value={month.id}>
                {month.name}
              </option>
            ))}
          </select>
        </div>

        {/* End Year */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="end-year" className="text-sm font-medium ">
            ปีสิ้นสุด
          </label>
          <input
            id="end-year"
            type="number"
            placeholder="2568"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="input w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-end">
        <button
          onClick={handleClear}
          className="px-6 py-2.5 border border-gray-300 rounded-md  font-medium hover:bg-gray-50 transition-colors"
        >
          ล้างข้อมูล
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          ค้นหา
        </button>
      </div>
    </div>
  )
}

export default MonthRangeSearch