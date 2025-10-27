'use client'

const AttendaceSum = () => {
  const data = [
    { id: 1, year: 2023, month: "มกราคม", day: 20 },
    { id: 2, year: 2023, month: "กุมภาพันธ์", day: 20 },
    { id: 3, year: 2023, month: "มีนาคม", day: 20 },
    { id: 4, year: 2023, month: "เมษายน", day: 20 },
    { id: 5, year: 2023, month: "พฤษภาคม", day: 20 },
    { id: 6, year: 2023, month: "มิถุนายน", day: 20 },
    { id: 7, year: 2023, month: "กรกฎาคม", day: 20 },
    { id: 8, year: 2023, month: "สิงหาคม", day: 20 },
    { id: 9, year: 2023, month: "กันยายน", day: 20 },
    { id: 10, year: 2023, month: "ตุลาคม", day: 20 },
    { id: 11, year: 2023, month: "พฤศจิกายน", day: 20 },
    { id: 12, year: 2023, month: "ธันวาคม", day: 20 },
  ];

  const totalDays = data.reduce((sum, item) => sum + item.day, 0);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full">
        <thead className="bg-info sticky top-0 z-30">
          <tr>
            <th className="border border-gray-300 px-4 py-2">ลำดับ</th>
            <th className="border border-gray-300 px-4 py-2">ปี</th>
            <th className="border border-gray-300 px-4 py-2">เดือน</th>
            <th className="border border-gray-300 px-4 py-2">วันมาเรียน</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id} className={`bg-base-100 ${idx % 2 === 0 ? "bg-white/20" : ""}`}>
              <td className="border border-gray-300 px-4 py-2 text-center">{idx + 1}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.year}</td>
              <td className="border border-gray-300 px-4 py-2">{item.month}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.day}</td>
            </tr>
          ))}
          <tr className="font-bold bg-base-200">
            <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">
              รวมวันมาเรียน
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {totalDays} วัน
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AttendaceSum;
