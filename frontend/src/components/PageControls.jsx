import Pagination from "@mui/material/Pagination";

const PageControls = ({ page, totalPages, onChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center m-0">
            <Pagination
                size="large"
                count={totalPages}
                page={page}
                onChange={onChange}
                color="primary"
            />
        </div>
    );
};

export default PageControls;
