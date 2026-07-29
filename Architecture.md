# Pinia Task Manager Architecture

이 문서는 Pinia Task Manager의 전체 구조와 주요 실행 흐름을 텍스트 기반 Mermaid 플로우차트로 설명합니다.

## 1. 전체 시스템 구조

```mermaid
flowchart TB
    User["사용자 / Browser"]

    subgraph App["Vue 3 Application"]
        Main["main.ts<br/>애플리케이션 초기화"]
        Root["App.vue<br/>RouterView"]

        subgraph RouterLayer["Router Layer"]
            Router["router/index.ts"]
            Guard{"Navigation Guard"}
        end

        subgraph ViewLayer["View Layer"]
            LoginView["LoginView.vue"]
            TaskView["TaskView.vue"]
            DashboardView["DashboardView.vue"]
        end

        subgraph ComponentLayer["Component Layer"]
            Header["AppHeader"]
            TaskForm["TaskForm"]
            TaskFilter["TaskFilter"]
            TaskList["TaskList"]
            TaskItem["TaskItem"]
            Statistics["TaskStatistics"]
            Loading["LoadingSpinner"]
            Error["ErrorMessage"]
        end

        subgraph StoreLayer["Pinia Store Layer"]
            AuthStore["authStore<br/>사용자 · 인증 상태"]
            TaskStore["taskStore<br/>업무 · 필터 · 통계"]
        end

        subgraph ServiceLayer["Service Layer"]
            TaskApi["taskApi.ts<br/>Axios · 데이터 변환"]
        end

        subgraph TypeLayer["Type Layer"]
            AuthTypes["types/auth.ts"]
            TaskTypes["types/task.ts"]
        end
    end

    LocalStorage[("LocalStorage<br/>인증 정보 · 업무 목록")]
    JsonApi[("JSONPlaceholder API")]

    User --> Main
    Main --> AuthStore
    Main --> Router
    Main --> Root
    Root --> Router
    Router --> Guard
    Guard --> AuthStore
    Guard --> LoginView
    Guard --> TaskView
    Guard --> DashboardView

    LoginView --> AuthStore
    TaskView --> TaskStore
    DashboardView --> TaskStore

    TaskView --> Header
    TaskView --> TaskForm
    TaskView --> TaskFilter
    TaskView --> TaskList
    TaskView --> Statistics
    TaskView --> Loading
    TaskView --> Error
    TaskList --> TaskItem
    DashboardView --> Header
    DashboardView --> Statistics

    AuthStore <--> LocalStorage
    TaskStore <--> LocalStorage
    TaskStore --> TaskApi
    TaskApi <--> JsonApi

    AuthStore -. 타입 참조 .-> AuthTypes
    TaskStore -. 타입 참조 .-> TaskTypes
    TaskApi -. 타입 참조 .-> TaskTypes
    ComponentLayer -. 타입 참조 .-> TaskTypes
```

## 2. 애플리케이션 초기화와 인증 라우팅

```mermaid
flowchart TD
    Start([브라우저에서 앱 시작])
    CreateApp["Vue App 생성"]
    CreatePinia["Pinia 인스턴스 생성 및 등록"]
    Restore["authStore.restoreSession()"]
    ReadAuth["LocalStorage 인증 정보 읽기"]
    ParseAuth{"JSON 파싱 성공?"}
    RestoreUser["사용자 상태 복원"]
    ClearAuth["손상된 저장값 삭제<br/>user = null"]
    CreateRouter["Pinia를 전달하여 Router 생성"]
    Mount["Vue App 마운트"]
    RouteRequest["사용자가 경로 접근"]
    RequiresAuth{"requiresAuth 경로?"}
    LoggedIn{"로그인 상태?"}
    GuestOnly{"guestOnly 경로?"}
    Login["/login 표시"]
    Tasks["/tasks 표시"]
    Target["요청한 페이지 표시"]

    Start --> CreateApp
    CreateApp --> CreatePinia
    CreatePinia --> Restore
    Restore --> ReadAuth
    ReadAuth --> ParseAuth
    ParseAuth -- 성공 --> RestoreUser
    ParseAuth -- 실패 --> ClearAuth
    RestoreUser --> CreateRouter
    ClearAuth --> CreateRouter
    CreateRouter --> Mount
    Mount --> RouteRequest
    RouteRequest --> RequiresAuth
    RequiresAuth -- 예 --> LoggedIn
    LoggedIn -- 아니요 --> Login
    LoggedIn -- 예 --> Target
    RequiresAuth -- 아니요 --> GuestOnly
    GuestOnly -- "예 + 로그인 상태" --> Tasks
    GuestOnly -- "아니요 또는 비로그인" --> Target
```

Pinia를 Router보다 먼저 생성하고 Router 팩토리에 명시적으로 전달합니다. 따라서 Navigation Guard가 실행될 때 활성 Pinia 인스턴스를 안전하게 사용할 수 있습니다.

## 3. 로그인과 로그아웃 흐름

```mermaid
flowchart TD
    LoginForm["LoginView<br/>아이디 · 비밀번호 입력"]
    Submit["로그인 버튼 클릭"]
    LoginAction["authStore.login()"]
    LoadingOn["loading = true<br/>error = null"]
    Validate{"admin / 1234와 일치?"}
    SaveUser["user 상태 설정"]
    SaveSession["LocalStorage에 사용자 저장"]
    MoveTasks["Router → /tasks"]
    LoginError["error 메시지 설정"]
    ShowError["LoginView에 오류 표시"]
    LoadingOff["finally: loading = false"]

    Header["AppHeader<br/>로그아웃 버튼"]
    LogoutAction["authStore.logout()"]
    ClearState["user = null"]
    RemoveSession["LocalStorage 인증 정보 삭제"]
    MoveLogin["Router → /login"]

    LoginForm --> Submit
    Submit --> LoginAction
    LoginAction --> LoadingOn
    LoadingOn --> Validate
    Validate -- 일치 --> SaveUser
    SaveUser --> SaveSession
    SaveSession --> LoadingOff
    LoadingOff --> MoveTasks
    Validate -- 불일치 --> LoginError
    LoginError --> LoadingOff
    LoadingOff --> ShowError

    Header --> LogoutAction
    LogoutAction --> ClearState
    ClearState --> RemoveSession
    RemoveSession --> MoveLogin
```

## 4. 초기 업무 조회 흐름

```mermaid
flowchart TD
    Enter["TaskView 또는 DashboardView 진입"]
    Mounted["onMounted()"]
    Fetch["taskStore.fetchTasks()"]
    HasTasks{"복원된 업무가 있는가?"}
    UseSaved["기존 Store 데이터 사용"]
    LoadingOn["loading = true<br/>error = null"]
    Request["taskApi.fetchInitialTasks()"]
    Axios["Axios GET<br/>JSONPlaceholder /todos?_limit=8"]
    RequestResult{"요청 결과"}
    Map["mapTodoToTask()<br/>외부 Todo → Task 변환"]
    SetTasks["tasks 상태에 저장"]
    Persist["LocalStorage에 저장"]
    SetError["사용자용 error 메시지 설정"]
    LoadingOff["finally: loading = false"]
    Render["화면 다시 렌더링"]

    Enter --> Mounted
    Mounted --> Fetch
    Fetch --> HasTasks
    HasTasks -- 예 --> UseSaved
    UseSaved --> Render
    HasTasks -- 아니요 --> LoadingOn
    LoadingOn --> Request
    Request --> Axios
    Axios --> RequestResult
    RequestResult -- 성공 --> Map
    Map --> SetTasks
    SetTasks --> Persist
    Persist --> LoadingOff
    RequestResult -- 실패 --> SetError
    SetError --> LoadingOff
    LoadingOff --> Render
```

## 5. 업무 CRUD와 반응형 상태 흐름

```mermaid
flowchart LR
    subgraph UI["사용자 인터페이스"]
        AddUI["TaskForm<br/>업무 추가"]
        EditUI["TaskItem → TaskForm<br/>업무 수정"]
        DeleteUI["TaskItem<br/>업무 삭제"]
        ToggleUI["TaskItem Checkbox<br/>완료 전환"]
    end

    subgraph Actions["taskStore Actions"]
        Add["addTask()"]
        Update["updateTask()"]
        Delete["deleteTask()"]
        Toggle["toggleTask()"]
        Persist["persistTasks()"]
    end

    State[("tasks State")]
    Storage[("LocalStorage")]

    subgraph Getters["Computed Getters"]
        Filtered["filteredTasks"]
        Total["totalCount"]
        Completed["completedCount"]
        Pending["pendingCount"]
    end

    Views["TaskView · DashboardView<br/>자동 재렌더링"]

    AddUI --> Add
    EditUI --> Update
    DeleteUI --> Delete
    ToggleUI --> Toggle

    Add --> State
    Update --> State
    Delete --> State
    Toggle --> State

    Add --> Persist
    Update --> Persist
    Delete --> Persist
    Toggle --> Persist
    Persist --> Storage

    State --> Filtered
    State --> Total
    State --> Completed
    State --> Pending

    Filtered --> Views
    Total --> Views
    Completed --> Views
    Pending --> Views
```

컴포넌트가 `tasks`를 직접 변경하지 않고 Action을 호출하므로 상태 변경, 비즈니스 규칙, LocalStorage 동기화가 Store 내부에서 함께 처리됩니다.

## 6. 검색과 필터 흐름

```mermaid
flowchart TD
    SearchInput["검색어 입력"]
    FilterButton["전체 · 진행 중 · 완료 선택"]
    SearchAction["setSearchKeyword()"]
    FilterAction["setFilter()"]
    SearchState["searchKeyword State"]
    FilterState["filter State"]
    Computed["filteredTasks Computed"]
    StatusMatch{"상태 조건과 일치?"}
    KeywordMatch{"제목 또는 설명에<br/>검색어 포함?"}
    Include["결과 목록에 포함"]
    Exclude["결과에서 제외"]
    TaskList["TaskList 자동 갱신"]

    SearchInput --> SearchAction
    FilterButton --> FilterAction
    SearchAction --> SearchState
    FilterAction --> FilterState
    SearchState --> Computed
    FilterState --> Computed
    Computed --> StatusMatch
    StatusMatch -- 아니요 --> Exclude
    StatusMatch -- 예 --> KeywordMatch
    KeywordMatch -- 예 --> Include
    KeywordMatch -- 아니요 --> Exclude
    Include --> TaskList
```

## 7. 컴포넌트 구조

```text
App.vue
└── RouterView
    ├── LoginView.vue
    │   └── 로그인 Form
    │
    ├── TaskView.vue
    │   ├── AppHeader.vue
    │   ├── TaskStatistics.vue
    │   ├── TaskForm.vue
    │   ├── TaskFilter.vue
    │   ├── LoadingSpinner.vue
    │   ├── ErrorMessage.vue
    │   └── TaskList.vue
    │       └── TaskItem.vue × N
    │
    └── DashboardView.vue
        ├── AppHeader.vue
        ├── TaskStatistics.vue
        ├── 완료율 Card
        └── 우선순위별 통계 Card
```

## 8. 파일 및 책임 구조

```text
pinia-task-manager/
├── index.html                  # Vite HTML 진입점
├── package.json                # 의존성 및 실행 스크립트
├── vite.config.ts              # Vite와 Vue 플러그인 설정
├── tsconfig*.json              # TypeScript 설정
├── README.md                   # 설치, 실행 및 주요 개념
├── Architecture.md             # 시스템 구조와 실행 흐름
└── src/
    ├── main.ts                 # Vue, Pinia, Router 초기화
    ├── App.vue                 # 최상위 RouterView
    ├── style.css               # 전역 및 반응형 스타일
    ├── router/
    │   └── index.ts            # 라우트 정의와 인증 Guard
    ├── stores/
    │   ├── auth.ts             # 로그인, 로그아웃, 세션 복원
    │   └── task.ts             # 업무 State, Getter, Action
    ├── services/
    │   └── taskApi.ts          # Axios 요청과 데이터 변환
    ├── types/
    │   ├── auth.ts             # User 타입
    │   └── task.ts             # Task, Filter, Input 타입
    ├── views/
    │   ├── LoginView.vue       # 로그인 페이지
    │   ├── TaskView.vue        # 업무 CRUD 페이지
    │   └── DashboardView.vue   # 업무 통계 페이지
    └── components/
        ├── AppHeader.vue       # 내비게이션과 로그아웃
        ├── TaskForm.vue        # 업무 추가와 수정
        ├── TaskFilter.vue      # 검색과 상태 필터
        ├── TaskList.vue        # 업무 목록 및 빈 상태
        ├── TaskItem.vue        # 단일 업무 표시와 조작
        ├── TaskStatistics.vue  # 전체, 진행 중, 완료 개수
        ├── LoadingSpinner.vue  # 비동기 로딩 상태
        └── ErrorMessage.vue    # API 오류와 재시도
```

## 9. 핵심 데이터 흐름 요약

```mermaid
flowchart LR
    User["사용자 입력"]
    Component["Vue Component"]
    Action["Pinia Action"]
    State["Pinia State"]
    Getter["Computed Getter"]
    Render["Vue 반응형 렌더링"]
    Local[("LocalStorage")]
    Service["Axios Service"]
    Api[("External API")]

    User --> Component
    Component --> Action
    Action --> State
    State --> Getter
    Getter --> Render
    Render --> Component

    Action <--> Local
    Action --> Service
    Service <--> Api
    Service --> Action
```

기본 데이터 흐름은 `사용자 입력 → 컴포넌트 → Pinia Action → State → Getter → 화면`입니다. 영속성이 필요한 상태는 Action에서 LocalStorage와 동기화하며, 외부 데이터는 Service 계층을 통해 Task 타입으로 변환한 뒤 Store에 저장합니다.
