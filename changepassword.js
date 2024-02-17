import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getAuth, onAuthStateChanged,EmailAuthProvider,reauthenticateWithCredential,updatePassword } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'

const firebaseConfig = {
    apiKey:"AIzaSyCQjdYppwfw2u_ulCLllzP0zrcr2lTzlMg",
    authDomain: "todolist-707f8.firebaseapp.com",
    databaseURL: "https://todolist-707f8-default-rtdb.firebaseio.com",
    projectId: "todolist-707f8",
    storageBucket: "todolist-707f8.appspot.com",
    messagingSenderId: "918793841068",
    appId: "1:918793841068:web:fd7d81a68d076453a8b209"
  };

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('change-password').addEventListener('click', async function() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    const errorMessage = document.getElementById('error-message');
    if(currentPassword===''){
        errorMessage.textContent = '현재 비밀번호를 입력해주세요';
        errorMessage.style.display = 'block';
        return;
    }
    else if(newPassword===''||confirmNewPassword===''){
        errorMessage.textContent = '새로운 비밀번호를 입력해주세요';
        errorMessage.style.display = 'block';
        return;
    }
    else if (newPassword !== confirmNewPassword) {
        errorMessage.textContent = '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.';
        errorMessage.style.display = 'block';
        return;
    }

    // 현재 로그인한 사용자의 비밀번호 변경 로직 추가
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
        // 사용자 재인증
        await reauthenticateWithCredential(user, credential);
        // 비밀번호 변경
        await updatePassword(user, newPassword);
        window.location.href = 'main.html';
        alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
        if (error.code === 'auth/invalid-login-credentials') {
          // 특정 에러 코드에 대한 사용자 친화적 메시지 표시
            console.error("Error logging in: ", error.code, error.message);
            errorMessage.textContent = "비밀번호를 잘못 입력하였습니다.";
            errorMessage.style.display = 'block';
        } else {
            console.error("Error logging in: ", error.code, error.message);
            errorMessage.textContent = "로그인 중 오류가 발생했습니다.";
            errorMessage.style.display = 'block';
        }
    }
});