import { deleteDoc, addDoc, query, where, orderBy, getDocs, getDoc, collection } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, listAll, getDownloadURL, deleteObject, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

import { db, storage, endLoading } from './firebaseUtils.js';
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

let imagesToDelete = [];
let ImagesToUpload = [];
let newImagesCounter;
let imageContainer;

export async function initProjects() {
    const q = query(
        collection(db, "projects"),
        orderBy("featured", "asc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const projectData = doc.data();
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project-div');
        projectDiv.innerHTML = `
            <div class="project-info">
                <span class="project-label">اسم المشروع: </span>${projectData.name}
            </div>
            <div class="project-info">
                <span class="project-label">وصف المشروع: </span>${projectData.description}
            </div>
            <div class="project-info">
                <span class="project-label">ترتيب المشروع: </span>${projectData.featured}
            </div>
        `;
        projectDiv.addEventListener('click', () => {
            window.location.href = `./details/?id=${doc.id}`;
        });
        document.getElementById('projects-container').appendChild(projectDiv);
    });
    document.getElementById('add-project-btn').addEventListener('click', () => addNewProject());
    endLoading();
}


export async function initProjectDetails() {
    imageContainer = document.getElementById('image-container');
    document.getElementById('project-delete').style.backgroundColor = 'red';
    document.getElementById('image-upload').addEventListener('change', (event) => imageUploadButtonHandling());
    const projectId = getProjectId();
    const docRef = doc(db, "projects", projectId);
    const querySnapshot = await getDoc(docRef);
    if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        document.getElementById('project-name').value = data.name;
        document.getElementById('project-featured').value = data.featured;
        document.getElementById('project-description').value = data.description;
        document.getElementById('project-location').value = data.location;
        document.getElementById('project-startDate').value = data.startDate;
        document.getElementById('project-endDate').value = data.endDate;
        document.getElementById('project-percentage').value = data.percentage;
        document.getElementById('project-value').value = data.value;
        document.getElementById('project-supervisor').value = data.supervisor;
        document.getElementById('project-department').value = data.department;
        document.getElementById('project-imageURL').value = data.imageURL;
        document.getElementById('project-edit').addEventListener('click', () => setModeEditing());
        document.getElementById('project-save').addEventListener('click', () => saveChanges());
        document.getElementById('project-delete').addEventListener('click', () => deleteProject());
        loadImages();
    } else {
        window.location.href = '../';
    }
    endLoading();
}

function getProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function setModeEditing(mode = true) {
    const result = await Swal.fire({
        title: 'تعديل البيانات',
        text: "هل انت متأكد أنك تريد تعديل البيانات؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، تعديل البيانات',
        cancelButtonText: 'لا، إلغاء',
    });
    if (result.isConfirmed == false) {
        return;
    }

    if (mode == true) {
        document.getElementById('project-edit').style.display = 'none';
        document.getElementById('project-save').style.display = 'inline-block';
        document.getElementById('project-delete').style.display = 'inline-block';
        document.getElementById('image-upload-btn').style.display = 'inline-block';
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.style.display = 'inline-block';
        });
    }
    else {
        document.getElementById('project-edit').style.display = 'inline-block';
        document.getElementById('project-save').style.display = 'none';
        document.getElementById('project-delete').style.display = 'none';
        document.getElementById('image-upload-btn').style.display = 'none';
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.style.display = 'none';
        });
    }
    document.getElementById('project-name').disabled = !mode;
    document.getElementById('project-featured').disabled = !mode;
    document.getElementById('project-description').disabled = !mode;
    document.getElementById('project-location').disabled = !mode;
    document.getElementById('project-startDate').disabled = !mode;
    document.getElementById('project-endDate').disabled = !mode;
    document.getElementById('project-percentage').disabled = !mode;
    document.getElementById('project-value').disabled = !mode;
    document.getElementById('project-supervisor').disabled = !mode;
    document.getElementById('project-department').disabled = !mode;
    document.getElementById('project-imageURL').disabled = !mode;
}

async function saveChanges() {
    const result = await Swal.fire({
        title: 'تعديل البيانات',
        text: "هل انت متأكد أنك تريد حفظ البيانات؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، حفظ البيانات',
        cancelButtonText: 'لا، إلغاء',
    });
    if (result.isConfirmed == false) {
        return;
    }

    if (isNaN(parseInt(document.getElementById('project-featured').value))) {
        await Swal.fire({
            icon: 'error',
            title: 'حدث خطأ ما',
            text: "الترتيب يجب ان يكون رقم صحيح"
        });
    }
    else {
        Swal.fire({
            title: 'جارٍ تحديث البيانات...',
            text: 'يرجى الانتظار قليلاً',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const docRef = doc(db, "projects", getProjectId());
        const updates = {
            name: document.getElementById('project-name').value,
            featured: parseInt(document.getElementById('project-featured').value),
            description: document.getElementById('project-description').value,
            location: document.getElementById('project-location').value,
            startDate: document.getElementById('project-startDate').value,
            endDate: document.getElementById('project-endDate').value,
            percentage: document.getElementById('project-percentage').value,
            value: document.getElementById('project-value').value,
            supervisor: document.getElementById('project-supervisor').value,
            department: document.getElementById('project-department').value,
            imageURL: document.getElementById('project-imageURL').value,
        };
        await updateDoc(docRef, updates);
        saveImages();
    }
}

async function loadImages() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const folderRef = ref(storage, `projects/${projectId}/`);
    const res = await listAll(folderRef);
    imageContainer.innerHTML = '';
    res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
            displayImage(url, itemRef.name);
        });
    });
}

function displayImage(url, name, display = 'none') {
    const imgWrapper = document.createElement('div');
    const img = document.createElement('img');
    const deleteBtn = document.createElement('button');
    imgWrapper.classList.add('image-wrapper');
    img.src = url;
    img.alt = name;
    img.dataset.name = name;
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.display = display;
    deleteBtn.addEventListener('click', () => {
        imgWrapper.remove();
        imagesToDelete.push(name);
    });
    imgWrapper.appendChild(img);
    imgWrapper.appendChild(deleteBtn);
    imageContainer.insertBefore(imgWrapper, imageContainer.firstChild);
}

function imageUploadButtonHandling() {
    const files = event.target.files;
    Array.from(files).forEach((file) => {
        if (file.size > 3 * 1024 * 1024) {
            compressImage(file, 3, (compressedBlob) => {
                const url = URL.createObjectURL(compressedBlob);
                displayImage(url, file.name, 'inline-block');
                ImagesToUpload.push(new File([compressedBlob], file.name, { type: 'image/jpeg' }));
            });
        } else {
            const url = URL.createObjectURL(file);
            displayImage(url, file.name, 'inline-block');
            ImagesToUpload.push(file);
        }
    });
}

async function saveImages() {
    let counter = 0;
    for (let name of imagesToDelete) {
        counter = counter + 1;
        Swal.fire({
            title: 'جارٍ مسح الصور...',
            text: counter + ' من ' + imagesToDelete.length,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const fileRef = ref(storage, `projects/${getProjectId()}/${name}`);
        try {
            await deleteObject(fileRef);
        } catch (error) {
            console.error('An error occurred:', error.message);
        } finally {
        }
    }
    imagesToDelete = [];
    newImagesCounter = 1;
    uploadNewImages();
};

async function uploadNewImages() {
    if (newImagesCounter > ImagesToUpload.length) {
        await Swal.fire({
            icon: 'success',
            title: 'تم تحديث البيانات',
            text: 'شكراً لك، تم تحديث البيانات بنجاح.'
        });
        window.location.reload();
    }
    let file = ImagesToUpload[newImagesCounter - 1];
    const fileRef = ref(storage, `projects/${getProjectId()}/${file.name}`);
    const metadata = { contentType: file.type };
    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    uploadTask.on('state_changed',
        (snapshot) => {
            let percentage = parseInt((snapshot.bytesTransferred * 100) / snapshot.totalBytes);
            Swal.fire({
                title: 'جارٍ رفع الصورة ' + newImagesCounter + ' من ' + ImagesToUpload.length,
                text: percentage + "%",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        },
        async (error) => {
            await Swal.fire({
                icon: 'error',
                title: 'حدث خطأ ما',
                text: 'عزراً، حدث خطأ ما'
            });
            window.location.reload();
        },
        async () => {
            if (newImagesCounter == ImagesToUpload.length) {
                await Swal.fire({
                    icon: 'success',
                    title: 'تم تحديث البيانات',
                    text: 'شكراً لك، تم تحديث البيانات بنجاح.'
                });
                window.location.reload();
            }
            else {
                newImagesCounter = newImagesCounter + 1;
                uploadNewImages();
            }
        }
    );
}

function compressImage(file, maxSizeMB, callback) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            let quality = 1.0;
            let blob;
            do {
                blob = dataURLToBlob(canvas.toDataURL('image/jpeg', quality));
                quality -= 0.05; // Reduce quality by 5% each iteration
            } while (blob.size > maxSizeMB * 1024 * 1024 && quality > 0);

            callback(blob);
        };
    };
    reader.readAsDataURL(file);
}

function dataURLToBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

async function addNewProject() {
    const result = await Swal.fire({
        title: 'اضافة مشروع',
        text: "هل انت متأكد أنك تريد اضافة مشروع جديد؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، اضافة مشروع جديد',
        cancelButtonText: 'لا، إلغاء',
    });
    if (result.isConfirmed == false) {
        return;
    }

    Swal.fire({
        title: 'جارٍ اضافة مشروع...',
        text: 'يرجى الانتظار قليلاً',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    try {
        const projectData = {
            department: "Undefined",
            description: "Undefined",
            endDate: "Undefined",
            featured: 0,
            imageURL: "Undefined",
            location: "Undefined",
            name: "Undefined",
            percentage: "Undefined",
            startDate: "Undefined",
            supervisor: "Undefined",
            value: "Undefined"
        };
        const docRef = await addDoc(collection(db, "projects"), projectData);
        window.location.href = `./details/?id=${docRef.id}`;
    } catch (e) {
        console.log(e);
        await Swal.fire({
            icon: 'error',
            title: 'حدث خطأ ما',
            text: 'عزراً، حدث خطأ ما'
        });
        window.location.reload();
    }
}

async function deleteProject() {
    const result = await Swal.fire({
        title: 'مسح المشروع',
        text: "هل انت متأكد أنك تريد مسح المشروع نهائياً؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، مسح المشروع',
        cancelButtonText: 'لا، إلغاء',
    });
    if (result.isConfirmed == false) {
        return;
    }

    Swal.fire({
        title: 'جارٍ مسح المشروع...',
        text: 'يرجى الانتظار قليلاً',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    let docId = getProjectId();
    try {
        await deleteDoc(doc(db, "projects", docId));
        const storage = getStorage();
        const folderRef = ref(storage, `projects/${docId}/`);
        const fileList = await listAll(folderRef);
        for (const itemRef of fileList.items) {
            await deleteObject(itemRef);
        }
        await Swal.fire(
            'Deleted!',
            'تم مسح المشروع بنجاح',
            'success'
        );
    } catch (e) {
        console.log(e);
        await Swal.fire({
            icon: 'error',
            title: 'حدث خطأ ما',
            text: 'عزراً، حدث خطأ ما'
        });
    }
    window.location.href = `../`;
}
