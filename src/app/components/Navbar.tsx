'use client'
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ThemeSwitch from "./ThemeSwitch"
import { getMenu, iconMap } from "@/data/appMenu";
import Axios from "@/lib/axios"
import Swal from "sweetalert2"
import { UserCircle2 } from "lucide-react"
import { useAppStore } from "@/store/appState"
type MenuItem = {
    label: string
    link?: string
    icon: string
    onClick?: () => void
}

const Navbar = () => {
    const isDark = useAppStore((state) => state.isDark)
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [appMenu, setAppMenu] = useState<any[]>([])
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [teacherPhoto, setTeacherPhoto] = useState<string | null>(null)

    const handleToggle = () => setOpen(!open)
    const handleClose = () => setOpen(false)
    const handleLogout = () => {
        Swal.fire({
            icon: 'warning',
            title: 'ยืนยันการออกจากระบบ',
            theme: isDark ? 'dark' : 'light',
            text: 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?',
            showCancelButton: true,
            confirmButtonText: 'ใช่ ออกจากระบบ',
            cancelButtonText: 'ยกเลิก',
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.post('/logout')
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'ออกจากระบบเรียบร้อย',
                            theme: isDark ? 'dark' : 'light',
                            timer: 1500,
                            showConfirmButton: false,
                        }).then(() => {
                            router.push('/login');
                            router.refresh();
                        });
                    })
                    .catch((error) => {
                        console.error('Logout error:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'เกิดข้อผิดพลาด',
                            theme: isDark ? 'dark' : 'light',
                            text: 'ไม่สามารถออกจากระบบได้',
                        });
                    });
            }
        });
        handleClose();
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])


    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch('/api/me')  // ✅ ต้อง await
                const json = await res.json()
                setUserId(json.userId)
                setAppMenu(getMenu(json.userId))
            } catch (error) {
                console.error('Failed to fetch user:', error)
            }
        }
        fetchMe()
    }, [])
    useEffect(() => {
        if (userId) {
            const fetchPhoto = async () =>{
                try {
                    const tPhoto = await Axios.get(`/teachers/photo/${userId}`)
                    setTeacherPhoto(tPhoto.data.data.photo)
                }catch (error) {
                    setTeacherPhoto(null)
                }
             } 
             fetchPhoto()  
        }
        
    },[userId])

    if (!userId) return <div>Loading...</div>
    return (
        <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-500/30 via-gray-400/30 to-gray-500/30 backdrop-blur-xs flex items-center justify-between py-2 px-6 shadow-lg z-50">
            <Link href="/" className="text-white text-lg font-bold tracking-wide">Time Stat</Link>
            <div className="flex gap-2 items-center">

                <ThemeSwitch />
                <div ref={dropdownRef} className="relative">
                    {/* Button */}
                    <div
                        role="button"
                        className="cursor-pointer p-1 hover:bg-white/20 rounded-full transition-colors"
                        onClick={handleToggle}
                    >
                        {
                            teacherPhoto ? (
                                <img src={`${process.env.NEXT_PUBLIC_API_URL}/${teacherPhoto.replace(/\\/g, '/')}`} alt="Profile" className="w-[26px] h-[26px] object-cover rounded-full" />
                            ) : (
                                <UserCircle2 size={26} />
                            )
                        }

                    </div>

                    {/* Dropdown */}
                    <ul
                        className={`
                        absolute right-0 mt-2 bg-base-300 rounded-xl shadow-xl border overflow-hidden
                        transform duration-200 origin-top-right
                        ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                    `}
                    >
                        {appMenu.map((menu: MenuItem, index: number) => {
                            const Icon = iconMap[menu.icon] || null;
                            const isLogout = menu.label === 'ออกจากระบบ';

                            return (
                                <li key={index}>
                                    {isLogout ? (
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-base-100 transition w-full text-left whitespace-nowrap"
                                        >
                                            {Icon && <Icon className="w-5 h-5" />}
                                            <span>{menu.label}</span>
                                        </button>
                                    ) : menu.link ? (
                                        <Link
                                            href={menu.link}
                                            onClick={handleClose}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-base-100 transition whitespace-nowrap w-full text-left"
                                        >
                                            {Icon && <Icon className="w-5 h-5" />}
                                            <span>{menu.label}</span>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={menu.onClick}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-base-100 transition w-full text-left whitespace-nowrap"
                                        >
                                            {Icon && <Icon className="w-5 h-5" />}
                                            <span>{menu.label}</span>
                                        </button>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
