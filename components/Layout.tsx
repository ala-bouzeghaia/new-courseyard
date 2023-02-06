import styles from '../styles/Layout.module.scss';
import Sidebar from './Sidebar';

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
