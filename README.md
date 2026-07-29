# Pinia Task Manager

Vue 3의 Composition API와 Pinia를 학습할 수 있는 반응형 업무 관리 애플리케이션입니다. 테스트 로그인, 업무 CRUD, 검색/필터, 통계 대시보드, API 로딩 및 브라우저 저장을 실제로 실행 가능한 형태로 제공합니다.

## 주요 기능

- 테스트 계정 로그인/로그아웃과 세션 복원
- JSONPlaceholder 비동기 초기 데이터 조회, 로딩 및 오류 처리
- 업무 추가, 수정, 삭제, 완료 전환
- 상태 필터와 제목/설명 검색
- 전체/진행 중/완료 통계, 완료율과 우선순위 통계
- 인증 Router Guard 및 반응형 UI
- 로그인 정보와 업무 목록 LocalStorage 저장

## 기술

Vue 3, Vite, TypeScript, Pinia, Vue Router, Axios, Composition API, `<script setup lang="ts">`, 기본 CSS

## 구조

```text
src/
├─ components/  # 재사용 가능한 폼, 목록, 필터, 통계 및 상태 UI
├─ views/       # 로그인, 업무, 대시보드 페이지
├─ stores/      # auth 및 task Pinia Store
├─ router/      # 라우트와 인증 Guard
├─ services/    # Axios API 및 데이터 변환
├─ types/       # 공유 TypeScript 타입
├─ App.vue
└─ main.ts
```

## 설치 및 실행

```bash
npm install
npm run dev
```

터미널에 출력되는 주소(기본 `http://localhost:5173`)로 접속합니다.

```bash
npm run type-check
npm run build
npm run preview
```

테스트 계정은 아이디 `admin`, 비밀번호 `1234`입니다.

## Pinia 핵심 개념

State는 Store가 소유하는 원본 상태입니다. Getter는 State로부터 파생되는 읽기 전용 값이며, Action은 비즈니스 규칙에 따라 상태를 바꾸는 메서드입니다. `authStore`는 사용자, 로그인 처리 상태와 오류를 관리하고 `isLoggedIn`, `userName`을 제공합니다. `taskStore`는 업무, 필터, 검색어, API 상태를 관리하고 필터 결과와 네 가지 집계를 계산합니다.

`taskStore`는 Setup Store 방식으로 작성했습니다. `ref`가 State, `computed`가 Getter, 함수가 Action 역할을 하며 Composition API와 동일한 방식으로 관련 로직을 가까이 배치할 수 있습니다. 컴포넌트에서 State와 Getter를 구조 분해할 때는 `storeToRefs`를 사용해 Pinia의 반응성을 유지합니다. Action은 Store에서 직접 구조 분해하거나 호출해도 `this`/반응성 문제가 없습니다.

상태 변경은 컴포넌트에서 직접 수행할 수도 있지만, 이 프로젝트는 추가·수정·삭제·완료 전환을 Action에 모았습니다. 따라서 LocalStorage 저장과 상태 규칙이 한곳에서 함께 실행됩니다.

## 상태 복원과 라우팅

앱 시작 시 `authStore.restoreSession()`이 JSON 파싱을 안전하게 시도합니다. 업무 Store도 생성될 때 저장된 목록을 복원하며, 저장 값이 없을 때만 API를 호출합니다. 손상된 JSON은 삭제하고 빈 상태로 복구하므로 앱이 중단되지 않습니다.

Pinia를 먼저 생성한 뒤 Router 팩토리에 전달합니다. Navigation Guard는 `meta.requiresAuth` 라우트를 비로그인 사용자가 열면 `/login`으로 보내고, 로그인 사용자가 `/login`을 열면 `/tasks`로 보냅니다. 이 순서로 Router Guard에서도 활성 Pinia 인스턴스를 안전하게 사용합니다.

## 주요 흐름

1. 앱 시작 → 저장된 로그인 세션 복원
2. 로그인 성공 → `/tasks` 이동
3. 저장 업무가 없으면 API 조회 → 외부 Todo를 `Task`로 변환 → 저장
4. CRUD Action 실행 → 반응형 State 갱신 → LocalStorage 동기화
5. Getter가 필터 목록과 통계를 즉시 다시 계산
