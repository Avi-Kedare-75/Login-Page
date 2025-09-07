const loginLink = document.querySelector("#log-btn");     
const registerLink = document.querySelector("#reg-btn");  
const loginBox = document.querySelector(".login");
const registerBox = document.querySelector(".register");
const otpBox = document.querySelector(".otp-box");       
const logOpenBtn = document.querySelector("#Log-reg-btn"); 
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("#close");


logOpenBtn.addEventListener("click", () => {
  popup.classList.add("active");
  loginBox.classList.add("active");
  registerBox.classList.remove("active");
  otpBox.classList.remove("active");
});


closeBtn.addEventListener("click", () => {
  popup.classList.remove("active");
  loginBox.classList.remove("active");
  registerBox.classList.remove("active");
  otpBox.classList.remove("active");
});


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


const registerBtn = registerBox.querySelector("button");
registerBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const inputs = registerBox.querySelectorAll("input");
  const username = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const password = inputs[2].value.trim();

  if (!username || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    alert(data.msg);

    if (res.ok) {
      
      otpBox.classList.add("active");
      registerBox.classList.remove("active");
    }

  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});


const otpInput = document.querySelector("#otp-input");
const otpSubmit = document.querySelector("#otp-submit");

otpSubmit.addEventListener("click", async () => {
  const otp = otpInput.value.trim();
  const email = registerBox.querySelectorAll("input")[1].value.trim();

  if (!otp) {
    alert("Enter OTP");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    alert(data.msg);

    if (res.ok) {
      otpBox.classList.remove("active");
      loginBox.classList.add("active");
      registerBox.querySelectorAll("input").forEach(input => input.value = "");
      otpInput.value = "";
    }

  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});


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
      inputs.forEach(input => input.value = "");
    }

  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});

