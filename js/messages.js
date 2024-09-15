import { query, orderBy, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db, endLoading } from './firebaseUtils.js';

export async function initMessages() {
    const q = query(
        collection(db, "messages"),
        orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const projectData = doc.data();
        const date = formatDate(projectData.timestamp);
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project-div');
        projectDiv.innerHTML = `
            <div class="project-info">
                <span class="project-label">الاسم الاول: </span>${projectData.firstName}
            </div>
            <div class="project-info">
                <span class="project-label">الاسم الاخير: </span>${projectData.lastName}
            </div>
            <div class="project-info">
                <span class="project-label">البريد الالكتروني: </span>${projectData.email}
            </div>
            <div class="project-info">
                <span class="project-label" >التاريخ: </span>${date}
            </div>
            <div class="project-info">
                <span class="project-label">الرسالة: </span>${projectData.message}
            </div>
        `;
        document.getElementById('projects-container').appendChild(projectDiv);
    });
    endLoading();
}

function formatDate(timestamp) {
    const date = timestamp.toDate();
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Africa/Cairo'
    };
    const formattedDate = date.toLocaleString('ar-EG', options);
    return formattedDate;
}

