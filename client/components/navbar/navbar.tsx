import Image from 'next/image';
import styles from './navbar.module.css';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href='/'>
        <Image width={110} height={90} src='/logo.png' alt='Valorant Logo' />
      </Link>
    </nav>
  );
}
