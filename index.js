import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getAuth, onAuthStateChanged,signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'


// const appSettings={
//   databaseURL:"https://todolist-707f8-default-rtdb.firebaseio.com/"
// };
const appSettings = {
    apiKey:"AIzaSyCQjdYppwfw2u_ulCLllzP0zrcr2lTzlMg",
    authDomain: "todolist-707f8.firebaseapp.com",
    databaseURL: "https://todolist-707f8-default-rtdb.firebaseio.com",
    projectId: "todolist-707f8",
    storageBucket: "todolist-707f8.appspot.com",
    messagingSenderId: "918793841068",
    appId: "1:918793841068:web:fd7d81a68d076453a8b209"
  };
const app=initializeApp(appSettings);
// Firebase Auth 인스턴스 가져오기
const auth = getAuth(app);

// 사용자의 로그인 상태 변경 감지
onAuthStateChanged(auth, (user) => {
    if (user) {
        // 사용자가 로그인한 경우, main.html로 리디렉션
        window.location.href = 'main.html';
    }
    // 로그인하지 않은 경우, 현재 페이지(index.html)에 머무름
});

document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    // 비밀번호 입력 필드 값 변경 시 아이콘 가시성 업데이트
    function updateIconVisibility() {
        if (password.value) {
            togglePassword.style.visibility = 'visible';
        } else {
            togglePassword.style.visibility = 'hidden';
        }
    }

    // 초기 상태 업데이트
    updateIconVisibility();

    password.addEventListener('input', updateIconVisibility);

    togglePassword.addEventListener('click', () => {
        // 비밀번호 가시성 토글
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye-slash');
        togglePassword.classList.toggle('fa-eye');
    });
});

const loginErrorMessage=document.getElementById('login-error');

document.getElementById('login').addEventListener('click', function() {
    loginErrorMessage.style.display='none';
    login();
});
document.getElementById('password').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        loginErrorMessage.style.display='none';
        login();
    }
});

function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    const auth=getAuth();
    if(email==''||password==''){
        loginErrorMessage.textContent="아이디와 비밀번호를 입력해주세요.";
        loginErrorMessage.style.display = 'block';
        return;
    }

    signInWithEmailAndPassword(auth,email, password)
        .then((userCredential) => {
            // 로그인 성공
            var user = userCredential.user;
            console.log("Logged in as: ", user.email);
            window.location.href = 'main.html';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Error logging in: ", errorCode, errorMessage);
            // 로그인 실패 메시지 표시
            loginErrorMessage.textContent="아이디 또는 비밀번호를 잘못 입력하셨습니다.";
            loginErrorMessage.style.display = 'block';
        });
}