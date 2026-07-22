# Security Specification: Master Cleaning Booking System

This document defines the security boundaries, data invariants, and threat scenarios (the "Dirty Dozen" malicious payloads) for the Master Cleaning Firestore database, along with test patterns.

## 1. Data Invariants
- **Booking Creation Integrity**: Any user (including guest users) can create a booking, but the `status` must be initialized to `'예약대기'`.
- **Identity Lock**: If a logged-in user registers a booking, the `userId` field must match their authenticated Firebase UID (`request.auth.uid`). Once set, `userId` is immutable.
- **Admin Supremacy**: Administrative controls (updating status, editing booking details, writing administrative memos) are strictly gated behind verified admin emails (`juneyoungsuh93@gmail.com`).
- **Terminal State Lock**: Once a booking status becomes `'완료'` or `'취소'`, it cannot be modified further except by an admin.
- **Client query safety**: Querying list of bookings must enforce that users can only fetch their own bookings, or require admin credentials.

---

## 2. The "Dirty Dozen" Malicious Payloads
The following payloads represents attacks that our security rules MUST prevent.

### Payload 1: Self-Approved Booking (Identity Spoofing / State Shortcutting)
- **Intent**: A customer attempts to create a booking with `status: '예약완료'` or `status: '완료'` to bypass verification and payment.
- **Payload**:
  ```json
  {
    "name": "공격자",
    "contact": "010-1234-5678",
    "service": "입주청소",
    "address": "서울시 마포구 백범로 12",
    "size": 24,
    "preferredDate": "2026-08-01",
    "preferredTime": "09:00",
    "status": "완료"
  }
  ```
- **Expectation**: `PERMISSION_DENIED` (Customer cannot initialize a status other than `'예약대기'`).

### Payload 2: Admin Privilege Escalation (Self-Seeding Admin)
- **Intent**: An attacker attempts to create a document inside an un-vetted collection or overwrite admin lists.
- **Expectation**: `PERMISSION_DENIED` (All collections are closed by default; admin status is checked strictly via verified email check in rules).

### Payload 3: Spoofing Owner ID (Identity Spoofing)
- **Intent**: Attacker attempts to set `userId` to a victim's UID to make it look like the victim made the booking.
- **Payload**:
  ```json
  {
    "name": "공격자",
    "contact": "010-1234-5678",
    "service": "입주청소",
    "address": "서울시 마포구 백범로 12",
    "size": 24,
    "preferredDate": "2026-08-01",
    "preferredTime": "09:00",
    "status": "예약대기",
    "userId": "victim_uid_123"
  }
  ```
- **Expectation**: `PERMISSION_DENIED` (If `userId` is provided, it must match `request.auth.uid`).

### Payload 4: Overwriting Administrative Memo (Privilege Escalation)
- **Intent**: Customer attempts to edit their booking and write internal administrative memo themselves.
- **Payload**:
  ```json
  {
    "adminMemo": "이 고객은 특별 무료 서비스 대상임 (허위 작성)"
  }
  ```
- **Expectation**: `PERMISSION_DENIED` (Only Admin can modify `adminMemo`).

### Payload 5: Denying Wallet via Massive ID String (Resource Poisoning)
- **Intent**: Attacker attempts to write a booking with a document ID of 10,000 characters to bloat database indexes and cost.
- **Path**: `/bookings/very_long_junk_id_of_10000_chars_here...`
- **Expectation**: `PERMISSION_DENIED` (Document ID must match pattern and size limits).

### Payload 6: Value Poisoning via Malformed Phone Number (Input Validation Gap)
- **Intent**: Injecting non-numeric junk characters or scripts into the `contact` field.
- **Payload**:
  ```json
  {
    "name": "공격자",
    "contact": "<script>alert('hack')</script>",
    "service": "입주청소",
    "address": "서울시 마포구 백범로 12",
    "size": 24,
    "preferredDate": "2026-08-01",
    "preferredTime": "09:00",
    "status": "예약대기"
  }
  ```
- **Expectation**: `PERMISSION_DENIED` (Contact must match regex `^[0-9\-]+$`).

### Payload 7: Value Poisoning via Giant Text Notes (Resource Poisoning)
- **Intent**: Customer uploads a 20MB notes field to exhaust storage.
- **Payload**:
  ```json
  {
    "notes": "[A repeated 5 million times]"
  }
  ```
- **Expectation**: `PERMISSION_DENIED` (Notes size must be `<= 1000` characters).

### Payload 8: Cross-User Read/Query (Data Leak)
- **Intent**: A logged-in customer queries the entire list of bookings to spy on other customers.
- **Action**: `db.collection('bookings').get()`
- **Expectation**: `PERMISSION_DENIED` (Client is not authorized to list the bookings unless they filter by their own `userId` or are verified admin).

### Payload 9: Hijacking Someone Else's Booking Status (Identity Spoofing)
- **Intent**: Attacker attempts to update status to `'취소'` for a booking owned by another customer.
- **Expectation**: `PERMISSION_DENIED` (Non-admins can only modify their own bookings).

### Payload 10: Modifying Cleaned Booking (Terminal State Break)
- **Intent**: Customer attempts to change preferred date/time after the cleaning job was marked `'완료'` by the administrator.
- **Expectation**: `PERMISSION_DENIED` (Terminal states are locked against customer edits).

### Payload 11: Future Date Injection with Malformed Date Format
- **Intent**: Injecting garbage values like `'asdf-as-df'` into the `preferredDate` field.
- **Expectation**: `PERMISSION_DENIED` (Date must strictly match `^\d{4}-\d{2}-\d{2}$`).

### Payload 12: Changing Immutables (Identity / Integrity Break)
- **Intent**: Customer tries to change their name or cleaning size on an existing booking.
- **Expectation**: `PERMISSION_DENIED` (Customers can only edit `status` to `'취소'` on update).

---

## 3. Security Rules Outline (DRAFT)
The final `firestore.rules` will enforce these assertions cleanly at the database level.
