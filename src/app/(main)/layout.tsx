import Navbar from "../components/Navbar"

const MainLayout = ({ children, }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      {children}
    </>

  )
}
export default MainLayout