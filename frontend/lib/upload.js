import api from "./api";

export async function uploadImage(file) {

    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await api.post("/products/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return res.data.url;

    } catch (err) {

        console.log("UPLOAD ERROR:", err);
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);

        throw err;
    }
}