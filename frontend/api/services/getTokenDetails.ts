import axios from '../axios';

export async function getTokenDetails() {
    const token = await axios.get("/user/me");
    return token;
}