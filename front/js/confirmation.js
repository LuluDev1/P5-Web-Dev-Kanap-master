const orderId = new URLSearchParams(window.location.search).get("orderId");

const order_id = (document.querySelector(
  "#orderId"
).textContent = `${orderId}.`);
