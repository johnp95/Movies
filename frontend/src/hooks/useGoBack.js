import { useLocation, useNavigate } from "react-router-dom";

// Returns a handler that goes back to the previous in-app page, so its URL
// params (?page=, ?q=, ?sort=) come back with it. If this page was opened
// directly (no in-app history), it goes to `fallback` instead.
const useGoBack = (fallback = "/") => {
    const navigate = useNavigate();
    const location = useLocation();

    return () => {
        // React Router gives the first entry of a session the key "default"
        if (location.key !== "default") navigate(-1);
        else navigate(fallback);
    };
};

export default useGoBack;
