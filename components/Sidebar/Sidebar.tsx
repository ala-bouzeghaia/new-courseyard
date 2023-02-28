import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { IoHomeOutline, IoCalendarOutline, IoCaretForwardCircleOutline } from 'react-icons/io5';
import { MdOutlineAnalytics } from 'react-icons/md';
import { HiOutlineClipboardList, HiOutlineLogout, HiOutlineLogin } from 'react-icons/hi';
import styles from './Sidebar.module.scss';

function Sidebar() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const session = true;

  const handleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(!isSidebarOpen);
      console.log('clicked');
    }
  };

  return (
    <div className={`${styles['sidebar-menu']} ${styles[isSidebarOpen ? 'open' : 'close']}`}>
      <div
        className={`${styles['svg-container']} ${styles[isSidebarOpen ? 'open' : 'close']}`}
        onClick={handleSidebar}>
        <FaGraduationCap size={28} />
      </div>
      <div className={`${styles['sidebar-items']} `}>
        <ul>
          <li>
            <Link href="/">
              <a className={`${router?.asPath === '/' ? styles['active-item'] : ''}`}>
                <IoHomeOutline />
                {<span>Home</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/schedule">
              <a className={`${router?.asPath === '/schedule' ? styles['active-item'] : ''}`}>
                <IoCalendarOutline />
                {<span>Schedule</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/courses">
              <a className={`${router?.asPath === '/courses' ? styles['active-item'] : ''}`}>
                <HiOutlineClipboardList />
                {<span>Courses</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/videos">
              <a className={`${router?.asPath === '/videos' ? styles['active-item'] : ''}`}>
                <IoCaretForwardCircleOutline />
                {<span>Videos</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/analytics">
              <a className={`${router?.asPath === '/analytics' ? styles['active-item'] : ''}`}>
                <MdOutlineAnalytics />
                {<span>Analytics</span>}
              </a>
            </Link>
          </li>
          <li></li>

          {session ? (
            <li>
              <Link href="/signout">
                <a className={`${router?.asPath === '/signout' ? styles['active-item'] : ''}`}>
                  <HiOutlineLogout />
                  {<span>Logout</span>}
                </a>
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/signin">
                <a className={`${router?.asPath === '/signin' ? styles['active-item'] : ''}`}>
                  <HiOutlineLogin />
                  {<span>Login</span>}
                </a>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
