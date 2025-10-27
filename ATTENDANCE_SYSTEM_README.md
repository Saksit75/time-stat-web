# ระบบกรอกข้อมูลการมาเรียน (Attendance System)

## 📋 ภาพรวม
ระบบนี้ใช้ข้อมูลจาก API `/time-stat/get-form-time-stat` เพื่อสร้างตารางกรอกข้อมูลการมาเรียนของนักเรียนแต่ละระดับชั้น

## 🔧 การทำงาน

### 1. ข้อมูลจาก API
API ส่งข้อมูลในรูปแบบ:
```json
{
  "date": "2025-10-26T02:36:27.426Z",
  "formData": {
    "1": {
      "class_level": 1,
      "class_level_th": "อนุบาล 1",
      "amount_student_male": 1,
      "amount_student_female": 1,
      "amount_student_count": 2
    },
    "2": {
      "class_level": 2,
      "class_level_th": "อนุบาล 2",
      "amount_student_male": 0,
      "amount_student_female": 0,
      "amount_student_count": 0
    }
    // ... ระดับชั้นอื่นๆ
  },
  "teacher": null
}
```

### 2. การแปลงข้อมูล
ข้อมูลจาก API จะถูกแปลงเป็นรูปแบบตารางที่มี:
- **จำนวนทั้งหมด**: จำนวนนักเรียนชาย/หญิง/รวม (จาก API)
- **มา**: จำนวนนักเรียนที่มาเรียน (กรอกได้)
- **ไม่มา**: จำนวนนักเรียนที่ไม่มาเรียน (กรอกได้)
- **ขาด/ลา/ป่วย/มาสาย**: จำนวนนักเรียนในแต่ละสถานะ (กรอกได้)
- **หมายเหตุ**: ข้อความเพิ่มเติม (กรอกได้)

### 3. การใช้งาน

#### MyDatePicker Component
- รับ `initialDate` จาก API
- แสดงวันที่ในรูปแบบภาษาไทย
- ส่ง `onDateChange` callback เมื่อเปลี่ยนวันที่

#### AttendanceTable Component
- รับ `formData` จาก API
- แปลงข้อมูลเป็นตารางกรอกข้อมูล
- ส่ง `onDataChange` callback เมื่อข้อมูลเปลี่ยนแปลง
- คำนวณผลรวมอัตโนมัติ

#### Selecter Component
- รองรับ `value` และ `onChange` props
- แสดงรายชื่อครูผู้สอน

## 🎯 คุณสมบัติ

### ✅ ที่ทำงานแล้ว
- แสดงข้อมูลจาก API ในตาราง
- กรอกข้อมูลการมาเรียนได้
- คำนวณผลรวมอัตโนมัติ
- ใช้วันที่จาก API
- เลือกครูผู้สอน
- บันทึกและล้างข้อมูล

### 🔄 ที่ต้องพัฒนาต่อ
- API endpoint สำหรับบันทึกข้อมูล
- การตรวจสอบความถูกต้องของข้อมูล
- การแสดงข้อมูลที่บันทึกไว้แล้ว
- การส่งออกรายงาน

## 📁 ไฟล์ที่เกี่ยวข้อง

```
src/
├── types/
│   └── attendance.ts          # Type definitions
├── app/
│   ├── components/
│   │   ├── AttendanceTable.tsx # ตารางกรอกข้อมูล
│   │   ├── MyDatePicker.tsx    # เลือกวันที่
│   │   └── Selecter.tsx        # เลือกครู
│   └── (main)/
│       └── attendance/
│           └── page.tsx        # หน้าหลัก
```

## 🚀 การใช้งาน

1. เปิดหน้า `/attendance`
2. ระบบจะดึงข้อมูลจาก API อัตโนมัติ
3. กรอกข้อมูลการมาเรียนในแต่ละระดับชั้น
4. เลือกครูผู้สอน
5. คลิก "บันทึก" เพื่อบันทึกข้อมูล

## 🔧 การปรับแต่ง

### เพิ่มฟิลด์ใหม่
1. แก้ไข `AttendanceRow` interface ใน `attendance.ts`
2. เพิ่มคอลัมน์ในตาราง `AttendanceTable.tsx`
3. อัปเดตการแปลงข้อมูลใน `useEffect`

### เปลี่ยน API endpoint
แก้ไขใน `attendance/page.tsx`:
```typescript
const resForm = await Axios.get('/your-new-endpoint')
```
