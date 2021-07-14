import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <em>made by Z - Crackhead Jhin#9093</em>
        </li>
      </ul>
    </footer>
  );
}
