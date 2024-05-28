import styles from "./styles/innercontainer.module.css";

export const InnerContainer = ({ children }) => {
    return <div className={styles.innerContainer}>{children}</div>;
};
