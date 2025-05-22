import Link from 'next/link';
import styles from '../styles/CategoriasMenu.module.css';

const CategoriasMenu = () => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Categorías</h2>
      <ul className={styles.categories}>
        <li>
          <Link href="/categoria/camisetas" className={styles.link}>
            Camisetas
          </Link>
        </li>
        <li>
          <Link href="/categoria/pantalones" className={styles.link}>
            Pantalones
          </Link>
        </li>
        <li>
          <Link href="/categoria/chaquetas" className={styles.link}>
            Chaquetas
          </Link>
        </li>
        <li>
          <Link href="/categoria/zapatos" className={styles.link}>
            Zapatos
          </Link>
        </li>
        <li>
          <Link href="/categoria/accesorios" className={styles.link}>
            Accesorios
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CategoriasMenu;
