import { app, db, storage, endLoading } from './firebaseUtils.js';
import { setDoc, addDoc, collection, doc, getDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const auth = getAuth(app);

auth.onAuthStateChanged(async (user) => {
    if (user) {
        if (user.emailVerified) {
            if (window.location.pathname.includes("login/")) {
                await Swal.fire({
                    icon: 'success',
                    title: 'تم تسجيل الدخول',
                    text: 'شكراً لك، تم تسجيل الدخول بنجاح.'
                });
                location.href = "/";
            }
            if (window.location.pathname.includes("profile/")) {
                await initProfile(user);
            }
            document.getElementById("login-text").textContent = user.email.substring(0, user.email.length - 15);
            endLoading();
        }
        else if (!window.location.pathname.includes("signup/")) {
            await Swal.fire({
                title: "الحساب غير مفعل",
                text: "لم يتم تأكيد البريد الالكتروني لهذا الحساب، برجاء الذهاب للبريد الالكتروني لتأكيد الحساب قبل التمكن من تسجيل الدخول",
                icon: "error",
                confirmButtonText: "حسناً",
            })
            auth.signOut();
            location.href = "/login/";
        }
    }
    else {
        if (window.location.pathname.includes("login/") || window.location.pathname.includes("signup/")) {
            endLoading();
        }
        else {
            location.href = "/login/";
        }
    }
});
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        // persistence enabled
    })
    .catch((error) => {
        console.error(error);
    });

export function initLogin() {
    document.getElementById('forgot-btn').addEventListener('click', resetPassword);
    document.getElementById('myForm').addEventListener('submit', (event) => {
        event.preventDefault();
        logIn();
    });
    document.getElementById('signup-btn').addEventListener('click', function () {
        location.href = "/signup"
    });
    document.getElementById("email").addEventListener('input', function () {
        checkEmailValidity();
    });
    endLoading();
}

export function initSignUp() {
    document.getElementById('myForm').addEventListener('submit', (event) => {
        event.preventDefault();
        signUp();
    });
    document.getElementById("email").addEventListener('input', function () {
        checkEmailValidity();
    });
    endLoading();
}

export async function initProfile(user) {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const docData = docSnap.data();
        document.getElementById("name").value = docData.name
        document.getElementById("phone").value = docData.phone
        document.getElementById("address").value = docData.address
    }
    document.getElementById("login-text").innerHTML = user.email.substring(0, auth.currentUser.email.length - 15);
    document.getElementById("mail").value = user.email

    document.getElementById('signout').addEventListener('click', function () {
        Swal.fire({
            title: 'جارٍ تسجيل الخروج...',
            text: 'يرجى الانتظار قليلاً',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        auth.signOut()
    });

    document.getElementById('change-password').addEventListener('click', function () {
        Swal.fire({
            title: 'جارٍ ارسال بريد الكتروني لاعادة تعيين كلمة السر...',
            text: 'يرجى الانتظار قليلاً',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        sendPasswordResetEmail(auth, auth.currentUser.email)
            .then(function () {
                Swal.fire({
                    icon: 'success',
                    title: 'تم ارسال بريد الكتروني لاعادة تعيين كلمة السر',
                    confirmButtonText: 'حسنأ',
                })

            })
            .catch(function (error) {
                console.log(error);
                Swal.fire({
                    title: `خطأ`,
                    icon: 'error',
                    text: `حدث خطأ، برجاء المحاولة لاحقاً`,
                    confirmButtonText: 'حسنأ',
                })
            });
    });

    document.getElementById('save').addEventListener('click', function () {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        updateData(name, phone, address);
    });
    endLoading();
}


async function updateData(name, phone, address) {
    Swal.fire({
        title: 'جارٍ تعديل البيانات...',
        text: 'يرجى الانتظار قليلاً',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, 'users', userId);
    const userData = {
        name: name,
        phone: phone,
        address: address,
        email: auth.currentUser.email
    };

    try {
        await setDoc(userDocRef, userData, { merge: true });
        Swal.fire({
            icon: 'success',
            title: 'تم تعديل الصفحة الشخصية بنجاح',
            showConfirmButton: true,
            confirmButtonText: 'حسنأ',
        });
    } catch (error) {
        Swal.fire({
            title: `خطأ`,
            icon: 'error',
            text: `حدث خطأ، برجاء المحاولة لاحقاً`,
            confirmButtonText: 'حسنأ',
        })
    }
}




function checkEmailValidity() {
    const pattern = /^[a-zA-Z0-9._%+-]+@abnaashiba.com/;
    if (pattern.test(document.getElementById("email").value)) {
        document.getElementById("email").setCustomValidity("");
        document.getElementById("email").reportValidity();
        return true;
    }
    else {
        document.getElementById("email").setCustomValidity("Please enter a valid email address like example@abnaashiba.com");
        document.getElementById("email").reportValidity();
        return false;
    }
}

function logIn() {
    if (!checkEmailValidity()) {
        return;
    }

    Swal.fire({
        title: 'جارٍ تسجيل الدخول...',
        text: 'يرجى الانتظار قليلاً',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        })
        .catch((error) => {
            console.log(error.message)
            $('#loading').hide();
            Swal.fire({
                title: "خطأ في تسجيل الدخول",
                text: "البريد الالكتروني او الرقم السري غير صحيح",
                icon: "error",
                confirmButtonText: "اعادة المحاولة",
            })
        });
}

function signUp() {
    if (!checkEmailValidity()) {
        return;
    }

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;
    if (password != cpassword) {
        Swal.fire({
            title: `خطأ`,
            icon: 'error',
            text: `الرقم السري غير متطابق`,
            confirmButtonText: 'حسنأ',
        });
    }
    else {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                auth.signOut();
                const user = userCredential.user;
                await sendEmailVerification(user);
                await Swal.fire({
                    title: "تم انشاء حساب جديد بنجاح",
                    text: "برجاء الذهاب للبريد الالكتروني المسجل لتأكيد حسابك قبل ان تتمكن من تسجيل الدخول",
                    icon: "success",
                    confirmButtonText: "حسناً",
                });
                location.href = "/login";
            })
            .catch((error) => {
                if (error.code == 'auth/email-already-in-use') {
                    Swal.fire({
                        title: "الحساب موجود بالفعل",
                        text: "هذا الحساب موجود بالفعل، برجاء تسجيل الدخول بدلأ من انشاء حساب جديد",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: 'تسجيل الدخول',
                        cancelButtonText: 'الغاء',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.href = "/login";
                        }
                    });
                }
                else {
                    console.log(error)
                    Swal.fire({
                        title: `خطأ`,
                        icon: 'error',
                        text: `حدث خطأ ما، برجاء المحاولة لاحقاً`,
                        confirmButtonText: 'حسنأ',
                    })

                }
            });
    }
}

function resetPassword() {
    Swal.fire({
        title: 'نسيت كلمةالمرور؟',
        text: 'برجاء ادخال البريد الالكتروني',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'اعادة تعيين كلمة المرور',
        cancelButtonText: 'الغاء',
        showLoaderOnConfirm: true,
        preConfirm: (email) => {
            auth.sendPasswordResetEmail(email)
                .then(function () {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'تم ارسال بريد الكتروني لاعادة تعيين كلمة السر',
                        showConfirmButton: false,
                        timer: 3000
                    })

                })
                .catch(function (error) {
                    Swal.fire({
                        title: `خطأ`,
                        icon: 'error',
                        text: `البريد الالكتروني غير مسجل`,
                        confirmButtonText: 'حسنأ',

                    })
                });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
        }
    })
}
