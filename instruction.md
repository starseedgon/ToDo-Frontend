Vue 3와 Pinia를 활용한 학습용 샘플 프로젝트를 생성해 주세요.

## 1. 프로젝트 목표

Vue 3의 Composition API와 Pinia를 이용하여 다음 내용을 학습할 수 있는 샘플 애플리케이션을 만들어 주세요.

* Pinia Store 생성 및 등록
* State, Getter, Action 사용법
* 컴포넌트에서 Store 사용
* 여러 Store 간 데이터 연동
* 비동기 API 호출
* 로딩 상태와 오류 상태 관리
* LocalStorage를 이용한 상태 유지
* Vue Router와 Pinia 연동
* TypeScript 타입 정의
* 재사용 가능한 컴포넌트 구성

프로젝트는 단순한 코드 조각이 아니라 실제로 실행 가능한 완성된 프로젝트로 작성해 주세요.

## 2. 기술 스택

다음 기술을 사용해 주세요.

* Vue 3
* Vite
* TypeScript
* Pinia
* Vue Router
* Axios
* Composition API
* `<script setup lang="ts">`

패키지 매니저는 npm을 사용해 주세요.

## 3. 샘플 프로젝트 주제

간단한 업무 관리 애플리케이션을 구현해 주세요.

애플리케이션 이름은 `Pinia Task Manager`로 해 주세요.

다음 기능을 포함해 주세요.

### 사용자 기능

* 로그인
* 로그아웃
* 현재 로그인 사용자 정보 표시
* 로그인 상태 LocalStorage 저장
* 새로고침 후 로그인 상태 복원

실제 인증 서버는 사용하지 않고 테스트 계정을 이용한 가상 로그인 방식으로 구현해 주세요.

테스트 계정:

* 아이디: `admin`
* 비밀번호: `1234`

### 업무 관리 기능

* 업무 목록 조회
* 업무 추가
* 업무 수정
* 업무 삭제
* 업무 완료 및 미완료 전환
* 전체, 진행 중, 완료 필터
* 업무 제목 검색
* 전체 업무 개수 표시
* 완료 업무 개수 표시
* 미완료 업무 개수 표시

업무 데이터 구조는 다음을 기준으로 작성해 주세요.

```ts
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}
```

## 4. Pinia Store 구성

다음과 같이 Store를 분리해 주세요.

### `authStore`

파일 경로:

```text
src/stores/auth.ts
```

관리 항목:

* 현재 사용자
* 로그인 여부
* 로그인 처리
* 로그아웃 처리
* LocalStorage 복원
* 로그인 오류 메시지
* 로그인 처리 중 상태

State 예시:

```ts
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

Getter 예시:

* `isLoggedIn`
* `userName`

Action 예시:

* `login`
* `logout`
* `restoreSession`

### `taskStore`

파일 경로:

```text
src/stores/task.ts
```

관리 항목:

* 업무 목록
* 선택된 필터
* 검색어
* 로딩 상태
* 오류 상태

Getter 예시:

* `filteredTasks`
* `totalCount`
* `completedCount`
* `pendingCount`

Action 예시:

* `fetchTasks`
* `addTask`
* `updateTask`
* `deleteTask`
* `toggleTask`
* `setFilter`
* `setSearchKeyword`

가능하면 Setup Store 방식으로 구현해 주세요.

```ts
export const useTaskStore = defineStore('task', () => {
  // state
  // getters
  // actions
});
```

State를 직접 수정하는 경우와 Action을 통해 수정하는 경우의 차이를 코드 주석으로 설명해 주세요.

## 5. 비동기 API 처리

JSONPlaceholder API를 이용해 초기 업무 목록을 가져오거나, 별도의 Mock API 모듈을 만들어 사용해 주세요.

외부 API의 데이터 구조가 Task 인터페이스와 다르면 변환 함수를 작성해 주세요.

예:

```ts
function mapTodoToTask(todo: JsonPlaceholderTodo): Task {
  return {
    id: todo.id,
    title: todo.title,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    createdAt: new Date().toISOString(),
  };
}
```

API 호출 시 다음 상태를 명확히 관리해 주세요.

* 요청 시작 시 `loading = true`
* 요청 성공 시 데이터 저장
* 요청 실패 시 사용자에게 표시할 오류 메시지 저장
* 요청 종료 시 `loading = false`

`try`, `catch`, `finally`를 사용해 주세요.

## 6. 화면 구성

다음 페이지를 만들어 주세요.

### 로그인 페이지

경로:

```text
/login
```

기능:

* 아이디 입력
* 비밀번호 입력
* 로그인 버튼
* 로그인 중 버튼 비활성화
* 로그인 실패 메시지 표시
* 로그인 성공 시 `/tasks`로 이동

### 업무 목록 페이지

경로:

```text
/tasks
```

기능:

* 로그인 사용자 이름 표시
* 로그아웃 버튼
* 업무 통계 표시
* 업무 추가 폼
* 검색 입력창
* 필터 버튼
* 업무 목록
* 수정 버튼
* 삭제 버튼
* 완료 여부 체크박스
* 로딩 표시
* 오류 메시지
* 업무가 없을 때 빈 상태 메시지

### 대시보드 페이지

경로:

```text
/dashboard
```

기능:

* 전체 업무 수
* 완료 업무 수
* 미완료 업무 수
* 완료율 표시
* 우선순위별 업무 수 표시

## 7. 컴포넌트 구성

다음과 같이 컴포넌트를 분리해 주세요.

```text
src/
├─ components/
│  ├─ AppHeader.vue
│  ├─ TaskForm.vue
│  ├─ TaskFilter.vue
│  ├─ TaskList.vue
│  ├─ TaskItem.vue
│  ├─ TaskStatistics.vue
│  ├─ LoadingSpinner.vue
│  └─ ErrorMessage.vue
├─ views/
│  ├─ LoginView.vue
│  ├─ TaskView.vue
│  └─ DashboardView.vue
├─ stores/
│  ├─ auth.ts
│  └─ task.ts
├─ router/
│  └─ index.ts
├─ services/
│  └─ taskApi.ts
├─ types/
│  ├─ auth.ts
│  └─ task.ts
├─ App.vue
└─ main.ts
```

필요한 경우 구조를 개선해도 되지만, 역할별로 파일을 분리해 주세요.

## 8. Vue Router 인증 처리

로그인하지 않은 사용자가 `/tasks` 또는 `/dashboard`에 접근하면 `/login`으로 이동하도록 Navigation Guard를 구현해 주세요.

로그인한 사용자가 `/login`에 접근하면 `/tasks`로 이동하게 해 주세요.

라우터의 `meta` 정보를 활용해 주세요.

예:

```ts
{
  path: '/tasks',
  component: TaskView,
  meta: {
    requiresAuth: true,
  },
}
```

Pinia Store를 Router Guard에서 사용할 때 Pinia 초기화 순서에 문제가 발생하지 않도록 올바르게 구현해 주세요.

## 9. LocalStorage 처리

다음 데이터를 LocalStorage에 저장해 주세요.

* 로그인 사용자 정보
* 업무 목록

LocalStorage 접근 코드는 가능한 한 Store 또는 별도 유틸리티 모듈에서 관리해 주세요.

JSON 파싱 오류가 발생하더라도 애플리케이션이 중단되지 않도록 예외 처리를 해 주세요.

예:

```ts
function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem('tasks');

    if (!saved) {
      return [];
    }

    return JSON.parse(saved) as Task[];
  } catch {
    return [];
  }
}
```

## 10. UI 요구 사항

별도의 UI 프레임워크는 사용하지 말고 기본 CSS로 작성해 주세요.

다음 기준을 적용해 주세요.

* 반응형 레이아웃
* 데스크톱과 모바일에서 사용 가능
* 입력 폼과 버튼의 일관된 디자인
* 완료된 업무는 취소선 표시
* 우선순위별 배지 표시
* 오류 메시지는 명확히 구분
* 로딩 상태 표시
* 접근성을 고려한 label과 button 작성

CSS는 지나치게 복잡하지 않게 작성하되, 실행했을 때 완성된 애플리케이션처럼 보이도록 해 주세요.

## 11. 코드 품질 요구 사항

다음 기준을 반드시 지켜 주세요.

* 모든 코드에 TypeScript 타입 적용
* `any` 사용 최소화
* 컴포넌트 Props와 Emits 타입 정의
* 중복 코드 최소화
* 함수와 변수 이름을 명확하게 작성
* 비동기 오류 처리
* 빈 데이터 처리
* 컴포넌트 책임 분리
* 중요 로직에는 한글 주석 추가
* 사용하지 않는 import 제거
* ESLint 오류가 발생하지 않도록 작성

다음과 같이 Store의 값을 구조 분해할 때 반응성이 사라지지 않도록 `storeToRefs`를 사용해 주세요.

```ts
const taskStore = useTaskStore();

const {
  filteredTasks,
  totalCount,
  completedCount,
  pendingCount,
  loading,
  error,
} = storeToRefs(taskStore);
```

Action은 Store에서 직접 가져와 사용해 주세요.

```ts
const { addTask, deleteTask, toggleTask } = taskStore;
```

## 12. 실행 방법

다음 명령으로 프로젝트를 실행할 수 있도록 해 주세요.

```bash
npm install
npm run dev
```

필요한 패키지를 모두 `package.json`에 포함해 주세요.

다음 스크립트도 구성해 주세요.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit"
  }
}
```

## 13. README 작성

`README.md`에 다음 내용을 작성해 주세요.

* 프로젝트 소개
* 주요 기능
* 사용 기술
* 프로젝트 폴더 구조
* 설치 방법
* 실행 방법
* 빌드 방법
* 테스트 로그인 계정
* Pinia의 State, Getter, Action 설명
* `storeToRefs`를 사용하는 이유
* Setup Store 방식 설명
* LocalStorage 상태 복원 과정
* Router Guard 동작 방식
* 주요 코드 흐름

## 14. 작업 진행 방식

다음 순서로 작업해 주세요.

1. 현재 작업 디렉터리의 파일을 확인해 주세요.
2. 기존 프로젝트가 있으면 기존 파일을 무조건 삭제하지 말고 구조를 먼저 분석해 주세요.
3. 프로젝트가 없으면 Vite 기반 Vue 3 TypeScript 프로젝트를 생성해 주세요.
4. 필요한 npm 패키지를 설치해 주세요.
5. 타입, Store, API, Router, View, Component 순서로 구현해 주세요.
6. CSS를 작성해 주세요.
7. TypeScript 타입 검사를 실행해 주세요.
8. 프로덕션 빌드를 실행해 주세요.
9. 오류가 있으면 수정 후 다시 검사해 주세요.
10. 최종적으로 생성하거나 수정한 파일 목록을 정리해 주세요.

## 15. 최종 결과 보고

작업 완료 후 다음 내용을 보고해 주세요.

* 생성한 주요 파일
* 각 Pinia Store의 역할
* 주요 화면과 기능
* 실행 명령
* 타입 검사 결과
* 빌드 결과
* 실행 시 주의 사항
* 테스트 로그인 계정

설명만 하지 말고 실제 프로젝트 파일을 생성하고, 실행 및 빌드 가능한 상태로 완성해 주세요.
