import { headers } from 'next/headers';
import { getMenu, iconMap } from "@/data/appMenu";
import Link from "next/link";
export default async function Home() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id') || null;

  if (!userId) {
    return <div>Not authenticated</div>
  }

  const appMenu = getMenu(userId);
  
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {appMenu.map((menu) => {
        const Icon = iconMap[menu.icon];
        return (
          <Link
            href={menu.link}
            key={menu.id}
            className="group flex flex-col items-center justify-center gap-4 border border-gray-200 p-6 rounded-2xl shadow cursor-pointer 
                       transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-base-300"
          >
            <div className="flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110">
              <Icon className={menu.iconClass} />
            </div>
            <div className="font-semibold text-lg md:text-2xl text-center group-hover:text-primary">
              {menu.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
