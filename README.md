1. Refresh Token Rotation (The "Booby Trap") [Done]
================================================================================
This is the industry standard for securing refresh tokens. Your backend should implement Refresh Token Rotation (RTR).
How it works: Every single time your Angular app calls the /refresh API, the backend invalidates the old refresh token and sends back a brand new Access Token AND a brand new Refresh Token.
The Trap: If a hacker steals "Refresh Token A", but your legitimate Angular app has already used it to get "Refresh Token B", the backend flags "Refresh Token A" as dead.
The Trigger: If the hacker tries to send the stolen "Refresh Token A" to the API, the backend says: "Wait, this token was already used! Someone has been compromised."
The Defense: The backend immediately revokes ALL tokens associated with that user family (including the legitimate ones). The hacker is blocked, and the real user is simply forced to log in again with their OTP.

2. Move to HttpOnly Cookies (The Ultimate Shield)
==================================================
Right now, you are storing tokens in IndexedDB. While this is better than localStorage, any malicious JavaScript running on your site (an XSS attack) can still read IndexedDB and steal the token.

If you want absolute, bank-level security, you don't store tokens in Angular at all.

The Fix: Your backend should send the Refresh Token inside an HttpOnly Cookie.

Why it works: JavaScript (and therefore, hackers using XSS) cannot read HttpOnly cookies. It is physically impossible.

The browser automatically attaches the cookie to your /refresh API calls behind the scenes. Your Angular app never even sees the Refresh Token, meaning a hacker can never steal it from the frontend.

3. IP and Device Fingerprinting [Device management]
======================================================
Many secure backends track where a token was generated.

When the user logs in, the backend saves the user's IP address and User-Agent (Browser/Device info) alongside the refresh token in the database.

If a hacker in Russia steals the token from a user in India and tries to call the /refresh API, the backend notices the IP/Device mismatch and immediately kills the token.

4. Absolute Lifetimes and Idle Expirations
==============================================

Refresh tokens should not live forever.

Absolute Lifetime: The refresh token automatically dies after 7 days, no matter how many times it was rotated. The user must log in again eventually.

Idle Expiration: If the user doesn't open your app for 3 days, the refresh token dies early. This minimizes the window of time a hacker has to use a stolen token.

What should you do right now?
Since your frontend is in Angular (which has excellent built-in XSS protection by automatically sanitizing HTML), stealing tokens from your IndexedDB is already quite difficult for a hacker.

However, you should talk to your backend developer and ensure they have Refresh Token Rotation enabled. When you call your /refresh API, check the response—if they are giving you a new refresh token along with the access token (like in the JSON example you showed me earlier), you are already highly protected!