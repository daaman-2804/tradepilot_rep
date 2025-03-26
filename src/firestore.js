import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore"; 

const db = getFirestore();

export const saveUserData = async (userId, data) => {
    await setDoc(doc(db, "users", userId), data);
};

export const subscribeToUserData = (userId, callback) => {
    const unsubscribe = onSnapshot(doc(db, "users", userId), (doc) => {
        callback(doc.data());
    });
    return unsubscribe;
}; 