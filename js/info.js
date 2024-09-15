import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { db, storage, endLoading } from './firebaseUtils.js';


export async function infoInit() {
    const homeDocRef = doc(db, 'home', 'pSaDDznAMwdIzZ4KYxzX');
    const contactDocRef = doc(db, 'contact', '7jh5bsI8A7Qa1nFzOnmz');
    const homeDocSnap = await getDoc(homeDocRef);
    const contactDocSnap = await getDoc(contactDocRef);
    if (contactDocSnap.exists()) {
        const data = contactDocSnap.data();
        document.getElementById("address1").value = data.address[0].text;
        document.getElementById("address1_url").value = data.address[0].url;
        document.getElementById("address2").value = data.address[1].text;
        document.getElementById("address2_url").value = data.address[1].url;
        document.getElementById("phone1").value = data.phone[0];
        document.getElementById("phone2").value = data.phone[1];
        document.getElementById("facebook").value = data.facebook;
        document.getElementById("linkedin").value = data.linkedin;
    }
    else {
        await Swal.fire({
            icon: 'error',
            title: 'حدث خطأ ما',
            text: 'عزراً، حدث خطأ ما'
        });
        window.location.href = "/";
    }
    if (homeDocSnap.exists()) {
        const data = homeDocSnap.data();
        document.getElementById("header1_title").value = data.header1_title
        document.getElementById("header1_details").value = data.header1_details
        document.getElementById("header1_image").src = data.header1_image
        document.getElementById("header2_title").value = data.header2_title
        document.getElementById("header2_details").value = data.header2_details
        document.getElementById("header2_image").src = data.header2_image
        document.getElementById("header3_title").value = data.header3_title
        document.getElementById("header3_details").value = data.header3_details
        document.getElementById("header3_image").src = data.header3_image
        document.getElementById("icon1_details").value = data.icon1_details
        document.getElementById("icon2_details").value = data.icon2_details
        document.getElementById("icon3_details").value = data.icon3_details
        document.getElementById("icon4_details").value = data.icon4_details
        document.getElementById("projects_count").value = data.projects_count
        document.getElementById("engineers_count").value = data.engineers_count
        document.getElementById("about_details").value = data.about_details
        document.getElementById("about_image").src = data.about_image
        document.getElementById("header1_image_upload").addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById("header1_image").src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
        document.getElementById("header2_image_upload").addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById("header2_image").src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
        document.getElementById("header3_image_upload").addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById("header3_image").src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
        document.getElementById("about_image_upload").addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById("about_image").src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }
    else {
        await Swal.fire({
            icon: 'error',
            title: 'حدث خطأ ما',
            text: 'عزراً، حدث خطأ ما'
        });
        window.location.href = "/";
    }
    document.getElementById('info-edit').addEventListener('click', () => setModeEditing());
    document.getElementById('info-save').addEventListener('click', () => updateData());
    endLoading();
}

function setModeEditing(mode = true) {
    if (mode == true) {
        document.getElementById('info-edit').style.display = 'none';
        document.getElementById('info-save').style.display = 'inline-block';
    }
    else {
        document.getElementById('info-edit').style.display = 'inline-block';
        document.getElementById('info-save').style.display = 'none';
    }
    document.getElementById("header1_title").disabled = !mode;
    document.getElementById("header1_details").disabled = !mode;
    document.getElementById("header1_image_upload").disabled = !mode;
    document.getElementById("header2_title").disabled = !mode;
    document.getElementById("header2_details").disabled = !mode;
    document.getElementById("header2_image_upload").disabled = !mode;
    document.getElementById("header3_title").disabled = !mode;
    document.getElementById("header3_details").disabled = !mode;
    document.getElementById("header3_image_upload").disabled = !mode;
    document.getElementById("icon1_details").disabled = !mode;
    document.getElementById("icon2_details").disabled = !mode;
    document.getElementById("icon3_details").disabled = !mode;
    document.getElementById("icon4_details").disabled = !mode;
    document.getElementById("projects_count").disabled = !mode;
    document.getElementById("engineers_count").disabled = !mode;
    document.getElementById("about_details").disabled = !mode;
    document.getElementById("about_image_upload").disabled = !mode;
    document.getElementById("address1").disabled = !mode;
    document.getElementById("address1_url").disabled = !mode;
    document.getElementById("address2").disabled = !mode;
    document.getElementById("address2_url").disabled = !mode;
    document.getElementById("phone1").disabled = !mode;
    document.getElementById("phone2").disabled = !mode;
    document.getElementById("facebook").disabled = !mode;
    document.getElementById("linkedin").disabled = !mode;
}

async function uploadNewImage(file, folderPath, key) {
    const fileRef = ref(storage, folderPath + '/' + key);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
}

async function updateData() {
    Swal.fire({
        title: 'جارٍ تحديث البيانات...',
        text: 'يرجى الانتظار قليلاً',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    const homeDocRef = doc(db, 'home', 'pSaDDznAMwdIzZ4KYxzX');
    const contactDocRef = doc(db, 'contact', '7jh5bsI8A7Qa1nFzOnmz');
    const homeDocSnap = await getDoc(homeDocRef);
    const contactDocSnap = await getDoc(contactDocRef);
    let contactData;
    let homeData;
    if (contactDocSnap.exists()) {
        contactData = {
            address: [
                {
                    text: document.getElementById("address1").value,
                    url: document.getElementById("address1_url").value
                },
                {
                    text: document.getElementById("address2").value,
                    url: document.getElementById("address2_url").value
                }
            ],
            phone: [
                document.getElementById("phone1").value,
                document.getElementById("phone2").value
            ],
            facebook: document.getElementById("facebook").value,
            linkedin: document.getElementById("linkedin").value
        };
    }
    else {
        await Swal.fire({
            icon: 'error',
            title: 'حدث خطأ ما',
            text: 'عزراً، حدث خطأ ما'
        });
        window.location.href = "/";
    }
    if (homeDocSnap.exists()) {
        homeData = {
            header1_title: document.getElementById("header1_title").value,
            header1_details: document.getElementById("header1_details").value,
            header2_title: document.getElementById("header2_title").value,
            header2_details: document.getElementById("header2_details").value,
            header3_title: document.getElementById("header3_title").value,
            header3_details: document.getElementById("header3_details").value,
            icon1_details: document.getElementById("icon1_details").value,
            icon2_details: document.getElementById("icon2_details").value,
            icon3_details: document.getElementById("icon3_details").value,
            icon4_details: document.getElementById("icon4_details").value,
            projects_count: document.getElementById("projects_count").value,
            engineers_count: document.getElementById("engineers_count").value,
            about_details: document.getElementById("about_details").value,
            header1_image: document.getElementById("header1_image").src,
            header2_image: document.getElementById("header2_image").src,
            header3_image: document.getElementById("header3_image").src,
            about_image: document.getElementById("about_image").src
        };
        let newImageFile;
        newImageFile = document.getElementById("header1_image_upload").files[0];
        if (newImageFile) {
            Swal.fire({
                title: 'جارٍ رفع صورة عنوان 1...',
                text: 'يرجى الانتظار قليلاً',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const newImageUrl = await uploadNewImage(newImageFile, 'home', "header1_image");
            homeData.header1_image = newImageUrl;
        }
        newImageFile = document.getElementById("header2_image_upload").files[0];
        if (newImageFile) {
            Swal.fire({
                title: 'جارٍ رفع صورة عنوان 2...',
                text: 'يرجى الانتظار قليلاً',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const newImageUrl = await uploadNewImage(newImageFile, 'home', "header2_image");
            homeData.header2_image = newImageUrl;
        }
        else
            newImageFile = document.getElementById("header3_image_upload").files[0];
        if (newImageFile) {
            Swal.fire({
                title: 'جارٍ رفع صورة عنوان 3...',
                text: 'يرجى الانتظار قليلاً',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const newImageUrl = await uploadNewImage(newImageFile, 'home', "header3_image");
            homeData.header3_image = newImageUrl;
        }
        newImageFile = document.getElementById("about_image_upload").files[0];
        if (newImageFile) {
            Swal.fire({
                title: 'جارٍ رفع صورة عن الشركة...',
                text: 'يرجى الانتظار قليلاً',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const newImageUrl = await uploadNewImage(newImageFile, 'home', "about_image");
            homeData.about_image = newImageUrl;
        }
    } else {
        await Swal.fire({
            icon: 'error',
            title: 'حدث خطأ ما',
            text: 'عزراً، حدث خطأ ما'
        });
    }
    Swal.fire({
        title: 'جارٍ تحديث البيانات...',
        text: 'يرجى الانتظار قليلاً',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    await updateDoc(homeDocRef, homeData);
    await updateDoc(contactDocRef, contactData);
    await Swal.fire({
        icon: 'success',
        title: 'تم تحديث البيانات',
        text: 'شكراً لك، تم تحديث البيانات بنجاح.'
    });
    window.location.reload();

}