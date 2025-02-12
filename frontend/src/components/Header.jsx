import { Link } from 'react-router-dom';
import Icon from './Icons/Icon';
import IconBell from "./Icons/IconBell"
import IconUser from "./Icons/IconUser"
import IconLibrary from "./Icons/IconLibrary"
import "./Header.css";

export default function Header() {
  return (
    <header className="header flex justify-right gap-2 p-1 border">
      <Link to="/">
        <Icon IconImage={IconBell} style={{ width: "20px", fill: "var(--text-color)"}}/>
      </Link>
      <Link to="/Library">        
        <Icon IconImage={IconLibrary} style={{ width: "16px", fill: "var(--text-color)"}}/>
      </Link>
      <Link to="/User">
        <Icon IconImage={IconUser} style={{ width: "19px", fill: "var(--text-color)"}}/>
      </Link>
    </header>
  );
}