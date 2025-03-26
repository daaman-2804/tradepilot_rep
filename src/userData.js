import { saveUserData } from './firestore';
import { registerUser, loginUser } from './auth';

export const handleUserRegistration = async (email, password) => {
    const user = await registerUser(email, password);
    const userData = {
        email: user.email,
        createdAt: new Date(),
        // Add any other user-specific data you want to store
    };
    await saveUserData(user.uid, userData); // Save user data in Firestore
};

export const handleUserLogin = async (email, password) => {
    const user = await loginUser(email, password);
    // Optionally fetch user data from Firestore if needed
};