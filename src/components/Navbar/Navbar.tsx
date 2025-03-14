import { Link, useLocation } from 'react-router-dom';
import { Navbar } from 'flowbite-react';
import styles from './Navbar.module.css';

export default function NavbarComponent() { 
  const location = useLocation();

  return (
    <div className={styles.navWrapper}>
      <Navbar fluid className={styles.navbar}>
        <div className={styles.navLinks}>
          <Link 
            to="/project/players"
            className={`${styles.navLink} ${location.pathname.startsWith('/project/players') ? styles.active : ''}`}
          >
            Players
          </Link>
          <Link 
            to="/project/teams"
            className={`${styles.navLink} ${location.pathname.startsWith('/project/teams') ? styles.active : ''}`}
          >
            Teams
          </Link>
          <Link 
            to="/project/leagues"
            className={`${styles.navLink} ${location.pathname.startsWith('/project/leagues') ? styles.active : ''}`}
          >
            Leagues
          </Link>
          <Link 
            to="/project/countries"
            className={`${styles.navLink} ${location.pathname.startsWith('/project/countries') ? styles.active : ''}`}
          >
            Countries
          </Link>
        </div>
      </Navbar>
    </div>
  );
}
