import styles from './Layout.module.scss';
import Sidebar from '../Sidebar';

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default Layout;
