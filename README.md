# Email Nexus Backend

Email Nexus Backend is the core AI-orchestration engine built with **NestJS**. It manages secure user authentication via Google OAuth, integrates seamlessly with the Gmail API to manage and process incoming emails, and acts as a gateway bridge to **WhatsApp** for real-time AI email summaries, notifications, and interactions.

## 🔐 Authentication Details

The platform utilizes a dual-authentication strategy combining Google OAuth 2.0 and secure JWT tokens for downstream protected endpoints.

### Authentication Endpoints

#### 1. Google OAuth Login
- **Route:** `GET /auth/google/login`
- **Protection:** Google Passport Guard
- **Description:** Initiates the OAuth 2.0 authorization flow with Google. It requests scope permission for profile, email, and Gmail manipulation.

#### 2. Google Callback Redirection
- **Route:** `GET /auth/google/callback`
- **Description:** The final destination invoked by Google upon successful identity verification. 
- **Flow:**
    1. Extracts authorization tokens (AccessToken & RefreshToken).
    2. Maps the user profile to the internal database (creates if not exists / updates otherwise).
    3. Issues a secure internal JWT payload.
    4. Redirects back to the client application deeply (e.g., `http://localhost:8081/onboarding-success?token=<JWT>`) to hydrate the mobile application session.

---

## 📱 WhatsApp Setup Details

Once authenticated, users must establish a secure active link to their WhatsApp number. This ensures AI-generated content reaches the absolute right device securely.

### WhatsApp Flow

1. The user supplies their phone number inside the app.
2. Backend triggers an encrypted short-lived OTP directly to the user via **WhatsApp WAHA service**.
3. The user validates the otp received, solidifying the communication link.
4. Initial conversational bridge opens between the Nexus Agent and the User.

### WhatsApp & User Onboarding Endpoints

> All endpoints below require an `Authorization: Bearer <token>` header acquired during the login phase.

#### 1. Update & Verify Phone Number
- **Route:** `PATCH /user/update-phone`
- **Body:** `{ "phoneNumber": "+1234567890" }`
- **Action:** Persists the validated string to the user model and dispatches the initial ephemeral 6-digit verification OTP directly to the specified WhatsApp chat.

#### 2. Resend Verification Code
- **Route:** `GET /user/resend`
- **Action:** Identifies user from incoming JWT, invalidates old token maps, and issues a replacement OTP message over WhatsApp.

#### 3. Complete OTP Verification
- **Route:** `POST /user/verify-otp`
- **Body:** `{ "otp": "123456" }`
- **Action:** Validates user-submitted string against internal stored JWT claims. On success, initiates the "Welcome to Email Nexus" broadcast on the confirmed WhatsApp channel  and flushes the ephemeral map cache.

#### 4. Current Identity Retrieval (WhoAmI)
- **Route:** `GET /user/whoami`
- **Action:** Returns authenticated current profile metadata. this endpoint is created to validate the user accessToken and give them the profile.

---

## 📨 Gmail Integration

#### Fetch Latest Preview Sync
- **Route:** `GET /gmail/sync`
- **Protection:** JWT
- **Action:** Pulls user's persistent `googleRefreshToken`, negotiates fresh operational credentials, retrieves the latest high-priority inbox snippet deck, and delivers formatting context to the mobile preview stream.
