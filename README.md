🏦 Ng Secure Bank — Angular Security Demo

A security-focused banking application built to demonstrate modern, robust front-end security practices.




🚀 Overview

Ng Secure Bank is a demo application that simulates a banking UI built with Angular (standalone components).
Its primary purpose is to showcase front-end security principles, including:

Secure authentication flow:

Cookie-based “session” simulation
CSRF protection with token handling
XSS-safe UI patterns
Secure HTTP interceptors
Route-level authorization
Fake backend simulation for realistic behavior

This project is designed as a portfolio piece for Front-End Security Engineering and demonstrates how a front-end developer can implement security-conscious architecture even without a real backend.

🛡️ Security Concepts Implemented

The app is intentionally built like a real banking SPA, where security matters.
Here are the security features included:

🔐 1. Cookie-Based Authentication (Session Simulation)

After login, the fake backend issues two cookies:

FAKE_SESSION=123 → simulates an authenticated session
XSRF-TOKEN=fake-csrf-token-123 → CSRF protection token

These cookies are used to:

✔ Validate whether a session exists
✔ Allow /auth/me to restore the user after page refresh
✔ Protect POST operations on transfers

In real applications, FAKE_SESSION would be an HttpOnly, Secure, SameSite cookie.

🔄 2. Secure Authentication Flow With Memory Cache

The front end stores the logged-in user only in memory, never in localStorage, to avoid XSS persistence risks.

BehaviorSubject<User | null> in AuthService keeps in-memory state

After refresh, the app calls /auth/me to rebuild state from cookies

No tokens or sensitive data stored in localStorage → safer architecture

This mirrors real secure apps used by banks and enterprise systems.

🧭 3. AuthGuard + /auth/me Verification

The Angular AuthGuard integrates security best practices:

On first navigation → calls /auth/me to verify session

If backend returns 401 → redirect to /login

If valid → allow navigation and set internal user state

This enforces that session validity is always checked with the backend and not blindly trusted on the client.

🛡️ 4. CSRF Protection With Interceptor
✔ SecurityInterceptor

Adds the CSRF header automatically to every mutating request:

X-CSRF-Token: <value-from-cookie>

✔ Fake backend validates the header

If the header is missing or mismatched, transfer is rejected with 403 Invalid CSRF token.

This reproduces real backend behavior:

CSRF token lives in cookie

FE copies it into header

Backend matches the two

✋ 5. XSS-Safe Rendering (No innerHTML, No BypassSecurityTrust)

All UI rendering follows strict XSS-safe patterns:

No raw HTML injection

No custom sanitizers

No bypassSecurityTrustHtml pipes

Only Angular’s safe bindings ({{ }})

Inputs validated and type-safe

Security messages and banners use structured text, never interpreted HTML.

🔐 6. Fake Backend for Security Simulation

A custom Angular HttpInterceptor simulates backend behavior:

/auth/login → sets cookies, returns user

/auth/me → validates session cookie

/accounts → returns accounts only if logged in

/payments/transfer → requires valid CSRF token

/auth/logout → clears cookies

This gives the full experience of a secure backend without needing a server.

📡 7. Secure HTTP Interceptor Chain

Order of interceptors:

SecurityInterceptor
Adds CSRF tokens
Adds withCredentials
FakeBackendInterceptor
Handles server-like validation
ErrorInterceptor
Graceful error messages
Unauthorized handling
This structure mirrors professional Angular applications.

🧩 Application Features
🔐 Login Page

Angular Material design
Secure form handling
In-memory user caching

🏦 Dashboard

Account overview
Recent transactions table (Material table)
Security tips banner
Logout button (clears cookies + memory)

💸 Transfer Page

CSRF-protected transfer requests
Full Angular Material UI
Snackbar success notifications
Redirect after successful transfer

📁 Project Structure
src/app/
  core/
    auth/
      auth.service.ts
      auth.guard.ts
      user.model.ts
    security/
      csrf.service.ts
      security.interceptor.ts
      error.interceptor.ts
    fake-backend/
      fake-backend.interceptor.ts

  features/
    auth/
      login/
        login.component.ts
    banking/
      dashboard/
        dashboard.component.ts
      transfer/
        transfer.component.ts

  shared/
    components/
      security-banner/
        security-banner.component.ts


How Authentication Works (Step-by-Step)
1️⃣ User opens /bank/dashboard

Guard calls /auth/me → no cookies → 401 → redirect to /login.

2️⃣ Login

Successful login → backend sets cookies
FE stores user in memory

3️⃣ Navigate inside the bank

Guard sees user in memory → allows immediately

4️⃣ Refresh page

Memory is empty again
Guard calls /auth/me
Cookies exist → backend returns user → FE restores memory

5️⃣ Logout

Cookies cleared
Memory cleared
Guard prevents accessing /bank/*

🧪 Security Simulated: Banking-Level Flows

Session-based authentication
Stateful backend verification
CSRF token lifecycle
XSS-safe rendering
Guarded routes
Secure logging out
Interceptor-level control
This project shows that front-end developers play a crucial role in web application security.


🛠️ Technologies

Angular 18 (standalone components)
Angular Material
RxJS
Fake backend via HttpInterceptor
TypeScript strict mode

🚀 How to Run
npm install
npm start

Visit:
http://localhost:4200
