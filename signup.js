import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword,signOut,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

const appSettings = {
    apiKey:"AIzaSyCQjdYppwfw2u_ulCLllzP0zrcr2lTzlMg",
    authDomain: "todolist-707f8.firebaseapp.com",
    databaseURL: "https://todolist-707f8-default-rtdb.firebaseio.com",
    projectId: "todolist-707f8",
    storageBucket: "todolist-707f8.appspot.com",
    messagingSenderId: "918793841068",
    appId: "1:918793841068:web:fd7d81a68d076453a8b209"
  };
const app = initializeApp(appSettings);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        // 사용자가 로그인한 경우, main.html로 리디렉션
        window.location.href = 'main.html';
    }
    // 로그인하지 않은 경우, 현재 페이지(index.html)에 머무름
});

document.addEventListener('DOMContentLoaded', () => {
    const togglePasswords = document.querySelectorAll('.seePassword');
    const togglePassword=togglePasswords[0];
    const toggleConfirm=togglePasswords[1];
    const password = document.getElementById('signup-password');
    const confirm = document.getElementById('confirm-password');

    // 비밀번호 입력 필드 값 변경 시 아이콘 가시성 업데이트
    function updateIconVisibility() {
        if (password.value) {
            togglePassword.style.visibility = 'visible';
        } else {
            togglePassword.style.visibility = 'hidden';
        }
        if(confirm.value){
            toggleConfirm.style.visibility="visible";
        }else{
            toggleConfirm.style.visibility="hidden";
        }
    }
    // 초기 상태 업데이트
    updateIconVisibility();

    password.addEventListener('input', updateIconVisibility);
    confirm.addEventListener('input', updateIconVisibility);

    togglePassword.addEventListener('click', () => {
        // 비밀번호 가시성 토글
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye-slash');
        togglePassword.classList.toggle('fa-eye');
    });
    toggleConfirm.addEventListener('click', () => {
        // 비밀번호 가시성 토글
        const type = confirm.getAttribute('type') === 'password' ? 'text' : 'password';
        confirm.setAttribute('type', type);
        toggleConfirm.classList.toggle('fa-eye-slash');
        toggleConfirm.classList.toggle('fa-eye');
    });
});
const signupError = document.getElementById('signup-error');

document.getElementById('confirm-password').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        signupError.style.display='none';
        signup();
    }
});

document.getElementById('signup').addEventListener('click',function(){
    signupError.style.display='none';
    signup();
});

function signup() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword=document.getElementById('confirm-password').value;

  if (email === '' || password === '') {
      signupError.textContent = "Please enter both email and password.";
      signupError.style.display = 'block';
      return;
  }
  else if(password!==confirmPassword){
      signupError.textContent = "Passwords do not match.";
      signupError.style.display = 'block';
      return;
  }

  createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // 계정 생성 성공
          console.log("Account created for: ", email);
          signOut(auth).then(() => {
              // 로그아웃 성공, 로그인 페이지로 리다이렉트
              alert("새 계정이 생성되었습니다.");
              window.location.href = 'index.html';
          }).catch((error) => {
              // 로그아웃 에러 처리
              console.error("Sign out error", error);
          });
          window.location.href = 'index.html';
      })
      .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // Firebase에서 발생하는 auth/invalid-email 오류 처리
          if (errorCode === 'auth/invalid-email') {
              signupError.textContent = "Email is invalid.";
          } else {
              signupError.textContent = errorMessage;
          }
          signupError.style.display = 'block';
          console.error("Error during signup: ", errorCode, errorMessage);
      });
}