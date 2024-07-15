import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import AxiosInstance from "./Axios";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./styles/deletemodule.module.css";

const GetData = (id) => {
    return AxiosInstance.get(`api/movies/${id}`);
};

export const Delete = () => {
    const MyParam = useParams();
    const MyId = MyParam.id;
    const [myData, setMyData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetData(MyId);
                setMyData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [MyId]);

    const navigate = useNavigate();

    const submission = () => {
        AxiosInstance.delete(`api/movies/${MyId}/`).then(() => {
            navigate(`/`);
        });
    };

    return (
        <div className={styles.Container}>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <div>
                    <Box className={styles.title}>
                        <Typography sx={{ color: "#fff" }}>
                            Delete Movie {myData.name}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            boxShadow: 3,
                            padding: 4,
                            flexDirection: "column",
                        }}
                    >
                        <Box className={styles.text}>
                            Are you sure that you want to delete:{" "}
                            <strong>{myData.title}</strong>
                        </Box>
                        <Box className={styles.Container}>
                            <Button
                                variant="contained"
                                onClick={submission}
                                color="error"
                                size="large"
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </div>
            )}
        </div>
    );
};
