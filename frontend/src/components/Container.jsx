import styles from "./styles/container.module.css";

export const Container = ({ children }) => {
    return <div className={styles.parentContainer}>{children}</div>;
};
