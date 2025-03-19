

import Link from "next/link";

const Navbar = () => {

  return (
    <nav className="p-8 bg-gray-800 text-white">
      <ul className="flex gap-4">
      <li className="font-bold pr-8">
          <Link href="/">Inicio</Link>
        </li>
        <li className="font-bold">
          <Link href="/Login">Login</Link>
        </li>
        <li className="font-bold">
          <Link href="/Usuarios">Usuarios</Link>
        </li>
        <li className="font-bold">
          <Link href="/Proyectos">Proyecto</Link>
        </li>
        <li className="font-bold">
          <Link href="/Equipos">Equipos</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
