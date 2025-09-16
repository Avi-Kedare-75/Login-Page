// Elements
const logOpenBtn = document.querySelector("#Log-reg-btn");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("#close");

const loginBox = document.querySelector(".login");
const registerBox = document.querySelector(".register");
const otpBox = document.querySelector(".otp-box");

const loginLink = document.querySelector("#log-btn");
const registerLink = document.querySelector("#reg-btn");

// Open popup
logOpenBtn.addEventListener("click", () => {
    popup.classList.add("active");
    loginBox.classList.add("active");
    registerBox.classList.remove("active");
    otpBox.classList.remove("active");
});

// Close popup
closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    loginBox.classList.remove("active");
    registerBox.classList.remove("active");
    otpBox.classList.remove("active");
});

// Switch forms
loginLink.addEventListener("click", () => {
    loginBox.classList.add("active");
    registerBox.classList.remove("active");
    otpBox.classList.remove("active");
});
registerLink.addEventListener("click", () => {
    registerBox.classList.add("active");
    loginBox.classList.remove("active");
    otpBox.classList.remove("active");
});

// REGISTER
const registerBtn = registerBox.querySelector("button");
registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const inputs = registerBox.querySelectorAll("input");
    const username = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const mobile = inputs[2].value.trim();
    const password = inputs[3].value.trim();

    if (!username || !email || !mobile || !password) {
        alert("Please fill all fields");
        return;
    }

    // Debug log
    console.log("Register payload:", { name: username, email, mobile, password });

    try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username, email, mobile, password }) // ✅ fixed
        });

        const data = await res.json();
        alert(data.msg);

        if (res.ok) {
            registerBox.classList.remove("active");
            otpBox.classList.add("active");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});

// OTP Verification
const emailOtpInput = document.querySelector("#email-otp-input");
const mobileOtpInput = document.querySelector("#mobile-otp-input");
const otpSubmit = document.querySelector("#otp-submit");

otpSubmit.addEventListener("click", async () => {
    const email = registerBox.querySelectorAll("input")[1].value.trim();
    const mobile = registerBox.querySelectorAll("input")[2].value.trim();
    const emailOtp = emailOtpInput.value.trim();
    const mobileOtp = mobileOtpInput.value.trim();

    if (!emailOtp || !mobileOtp) {
        alert("Please enter both OTPs");
        return;
    }

    try {
        // Verify Email OTP
        let res = await fetch("http://localhost:5000/api/auth/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: emailOtp })
        });
        let data = await res.json();
        if (!res.ok) { alert(data.msg); return; }

        // Verify Mobile OTP
        res = await fetch("http://localhost:5000/api/auth/verify-mobile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile, otp: mobileOtp })
        });
        data = await res.json();
        alert(data.msg);

        if (res.ok) {
            otpBox.classList.remove("active");
            loginBox.classList.add("active");

            // Clear inputs
            registerBox.querySelectorAll("input").forEach(i => i.value = "");
            emailOtpInput.value = "";
            mobileOtpInput.value = "";
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});

// LOGIN
const loginBtn = loginBox.querySelector("button");
loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const inputs = loginBox.querySelectorAll("input");
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        alert(data.msg);

        if (res.ok) {
            localStorage.setItem("token", data.token);
            inputs.forEach(i => i.value = "");
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});
