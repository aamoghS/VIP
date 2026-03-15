import Link from "next/link";
import { Wrench, Zap, Trophy } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="glass-sidebar">
      <div className="logo">
        <div className="logo-icon"></div>
        <h1>VIP</h1>
      </div>
      <ul className="nav-links">
        <li>
          <Link href="/toolbox" className="nav-item">
            <Wrench className="icon" />
            <span>The Toolbox</span>
          </Link>
        </li>
        <li>
          <Link href="/sprint" className="nav-item">
            <Zap className="icon" />
            <span>The Sprint</span>
          </Link>
        </li>
        <li>
          <Link href="/room" className="nav-item">
            <Trophy className="icon" />
            <span>The Room</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
