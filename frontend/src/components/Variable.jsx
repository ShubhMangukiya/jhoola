export const API_URL = import.meta.env.VITE_API_URL;

export const userToken = () => {
    const userData = localStorage.getItem("zulas");
    if (!userData) return null; 
    
    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error("Invalid JSON in localStorage:", error);
        return null;
    }
};
