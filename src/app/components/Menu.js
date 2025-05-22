import Link from 'next/link';
import styles from '../styles/Menu.module.css';

const Menu = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.title}>CHEYN</div>

      <div className={styles.search}>
        <input type="text" placeholder="Buscar..." className={styles.searchInput} />
        <button className={styles.searchButton}>Buscar</button>
      </div>

      <div className={styles.buttons}>
        <a href="/crear-cuenta" className={styles.button}>
          Crear Cuenta
        </a>
        <a href="/mis-compras" className={styles.button}>
          Mis Compras
        </a>
        <Link href="/carrito" className={styles.button}>
          Carrito
        </Link>
      </div>
    </nav>
  );
};

export default Menu;