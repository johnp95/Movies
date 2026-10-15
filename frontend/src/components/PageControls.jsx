import Pagination from "@mui/material/Pagination";
import useMediaQuery from "@mui/material/useMediaQuery";

const PageControls = ({ page, totalPages, onChange }) => {
    // Smaller buttons and fewer neighbouring pages so it fits on a phone
    const isSmallScreen = useMediaQuery("(max-width:639px)");

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center my-4">
            <Pagination
                size={isSmallScreen ? "medium" : "large"}
                siblingCount={isSmallScreen ? 0 : 1}
                count={totalPages}
                page={page}
                onChange={onChange}
                color="primary"
            />
        </div>
    );
};

export default PageControls;
