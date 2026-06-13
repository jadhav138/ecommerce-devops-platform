async function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();

  document.getElementById("message").innerText =
    data.message || data.error;

  if (response.ok) {
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1000);
  }
}

async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token);
    document.getElementById("message").innerText = "Login successful";

    setTimeout(() => {
      window.location.href = "/products.html";
    }, 1000);
  } else {
    document.getElementById("message").innerText =
      data.message || data.error;
  }
}

async function loadProducts() {

  const response = await fetch("/api/products");

  const products = await response.json();

  const container = document.getElementById("products");

  container.innerHTML = "";

  products.forEach(product => {

    container.innerHTML += `
      <div class="product-card">
        <h3>${product.name}</h3>

        <div class="product-price">
          $${product.price}
        </div>

        <button
          class="buy-btn"
          onclick="placeOrder(${product.id})">
          Buy Now
        </button>
      </div>
    `;
  });

}

async function placeOrder(productId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "/login.html";
    return;
  }

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: 1
    })
  });

  const data = await response.json();

  if (response.ok) {
    alert("Order placed successfully!");
    window.location.href = "/orders.html";
  } else {
    alert(data.message || data.error || "Order failed");
  }
}

async function loadOrders() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "/login.html";
    return;
  }

  const response = await fetch("/api/orders", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const orders = await response.json();

  const container = document.getElementById("orders");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders found.</p>";
    return;
  }

  orders.forEach(order => {
    container.innerHTML += `
      <div class="order-card">
        <h3>${order.name}</h3>
        <p>Quantity: ${order.quantity}</p>
        <p>Price: $${order.price}</p>
        <p>Ordered At: ${new Date(order.created_at).toLocaleString()}</p>
      </div>
    `;
  });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}