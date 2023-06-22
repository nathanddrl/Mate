import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";

async function requestToJoinActivity(activityId, userId) {
    const db = getFirestore();
    const activityRef = doc(db, "activities", activityId);
  
    await updateDoc(activityRef, {
      joinRequests: arrayUnion(userId),
    });
  }

export default requestToJoinActivity;