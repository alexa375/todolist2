import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getDatabase,ref,set,push,onValue } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js'
import { getAuth, signInWithEmailAndPassword, signOut,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'

const appSettings = {
    apiKey: "AIzaSyCQjdYppwfw2u_ulCLllzP0zrcr2lTzlMg",
    authDomain: "todolist-707f8.firebaseapp.com",
    databaseURL: "https://todolist-707f8-default-rtdb.firebaseio.com",
    projectId: "todolist-707f8",
    storageBucket: "todolist-707f8.appspot.com",
    messagingSenderId: "918793841068",
    appId: "1:918793841068:web:fd7d81a68d076453a8b209"
  };

const app=initializeApp(appSettings);
const database=getDatabase(app);
const auth=getAuth(app);

onAuthStateChanged(auth,(user) => {
    if (!user) {
        // 사용자가 로그인하지 않았으면 로그인 페이지로 리디렉션
        window.location.href = 'index.html'; // 로그인 페이지 경로로 변경하세요
    }else{
        document.querySelector('.todo-container').classList.remove('hidden');
        loadTodos();
        setupModal();
    }
    console.log(user);
});
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const todoContainer = document.querySelector('.todo-container');

    hamburgerBtn.addEventListener('click', () => {
        // 사이드바의 'active' 클래스 토글
        sidebar.classList.toggle('active');

        // 사이드바 위치 조정 로직
        if (sidebar.classList.contains('active')) {
            const todoContainerRight = todoContainer.getBoundingClientRect().right;
            const todoContainerTop=todoContainer.getBoundingClientRect().top;
            const windowWidth = window.innerWidth;
            sidebar.style.top=`${todoContainerTop}px`;
            sidebar.style.right = `${windowWidth - todoContainerRight}px`;
            hamburgerBtn.innerHTML = '&times;'; // X 모양으로 변경
        } else {
            hamburgerBtn.innerHTML = '&#9776;'; // 햄버거 모양으로 변경
        }
    });

    // todo-container의 오른쪽 변의 x좌표를 기반으로 사이드바의 위치 조정
    const adjustSidebarPosition = () => {
        const todoContainerRight = todoContainer.getBoundingClientRect().right;
        const windowWidth = window.innerWidth;
        console.log(windowWidth, todoContainerRight)
        sidebar.style.right = `${windowWidth - todoContainerRight}px`;
    };
    window.addEventListener('resize', adjustSidebarPosition);
});

function setupModal() {
    const deleteModal = document.getElementById('deleteModal');
    const modalText = deleteModal.querySelector('p'); // 모달 내의 p 태그 찾기
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    const customDiv=document.getElementById('custom-div');

    // '삭제' 버튼 클릭 이벤트
    document.addEventListener('click', function(event) {
        if (event.target && event.target.className === 'delete-btn') {
            const textContent=event.target.parentElement.querySelector('span').textContent;
            customDiv.textContent=textContent;
            deleteModal.classList.remove('hidden'); // 모달 표시
            // 'line-height' CSS 속성 값 가져오기
            const style=window.getComputedStyle(customDiv);
            const lineHeight=parseFloat(style.lineHeight);
            // div의 실제 높이 가져오기
            const divHeight = customDiv.offsetHeight-parseFloat(style.paddingTop)*2;
            console.log(lineHeight,divHeight);
            // 한 줄일 때와 여러 줄일 때의 조건 설정
            if (divHeight > lineHeight) {
              // 여러 줄인 경우 (div 높이가 line-height보다 큰 경우)
              customDiv.style.textAlign = 'left';
            } else {
              // 한 줄인 경우
              customDiv.style.textAlign = 'center';
            }

            confirmDelete.onclick = function() {
                // 할 일 삭제 로직
                event.target.parentElement.remove();
                saveTodos();
                deleteModal.classList.add('hidden'); // 모달 숨김
            };

            cancelDelete.onclick = function() {
                deleteModal.classList.add('hidden'); // 모달 숨김
            };
        }
    });
}

document.getElementById('logout-btn').addEventListener('click', () => {
    const auth = getAuth();
    signOut(auth).then(() => {
        console.log('로그아웃 성공');
        window.location.href = 'index.html'; // 로그아웃 성공 시 리디렉션할 페이지
    }).catch((error) => {
        console.error('로그아웃 에러:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    loadTodos(); // 페이지 로딩 시 저장된 할 일 목록 불러오기
});

document.getElementById('add-todo').addEventListener('click', function() {
    addTodoItem();
});

document.getElementById('todo-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodoItem();
    }
});

function addTodoItem() {
    var todoInput = document.getElementById('todo-input');
    var newTodoText = todoInput.value.trim();
    if (newTodoText !== "") {
        // 할 일 항목 객체 생성
        const newTodoItem = {
            text: newTodoText,
            completed: false // 기본적으로 완료되지 않음으로 설정
        };
        createTodoItem(newTodoItem);
        saveTodos();
        todoInput.value = ""; // 입력 후 입력창 비우기
    }
}

function createTodoItem(todo) {
    var li = document.createElement('li');
    var textSpan = document.createElement('span');
    textSpan.textContent = todo.text;

    var checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'todo-checkbox';
    checkBox.checked = todo.completed; // 체크박스 상태 설정
    checkBox.addEventListener('change', function() {
        todo.completed = this.checked; // 체크 상태 업데이트
        saveTodos(); // 변경사항 저장
    });

    var deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.className = 'delete-btn';
    // deleteButton.onclick = function() {
    //     li.remove();
    //     saveTodos(); // 할 일 목록이 변경될 때마다 저장
    // };

    li.appendChild(checkBox);
    li.appendChild(textSpan);
    li.appendChild(deleteButton);

    document.getElementById('todo-list').appendChild(li);
}

function saveTodos() {
    var todos = [];
    document.querySelectorAll('#todo-list li').forEach(function(li) {
        const span = li.querySelector('span');
        const checkbox = li.querySelector('.todo-checkbox');
        todos.push({
            text: span.textContent,
            completed: checkbox.checked
        });
    });
    const todosRef = ref(database, 'todos');
    set(todosRef, todos);
}
function loadTodos() {
    const todosRef = ref(database, 'todos');
    onValue(todosRef, function(snapshot) {
        var todos = snapshot.val() || [];
        document.getElementById('todo-list').innerHTML = ''; // 목록 초기화
        todos.forEach(function(todo) {
            createTodoItem(todo);
        });
    });
}