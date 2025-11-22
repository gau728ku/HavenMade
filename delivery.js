document.addEventListener("DOMContentLoaded", () => {
  const paymentBtn = document.getElementById("proceed-payment-btn");

  paymentBtn.addEventListener("click", function () {
    let name = document.getElementById("full-name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();
    let address1 = document.getElementById("address1").value.trim();
    let address2 = document.getElementById("address2").value.trim();
    let city = document.getElementById("city").value.trim();
    let state = document.getElementById("state").value.trim();
    let pincode = document.getElementById("pincode").value.trim();

    // Validate fields
    if (!name || !phone || !email || !address1 || !city || !state || !pincode) {
      alert("Please fill all required delivery details.");
      return;
    }

    // Save Delivery Details
    let deliveryInfo = {
      name,
      phone,
      email,
      address1,
      address2,
      city,
      state,
      pincode
    };

    localStorage.setItem("deliveryDetails", JSON.stringify(deliveryInfo));

    // Get Cart + Total
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 1;   // <-- test with ₹1


    // RAZORPAY OPTIONS
    var options = {
      "key": "rzp_live_RigY3xdQPExOrR",  // <-- your live Razorpay key
      "amount": total * 100,
      "currency": "INR",
      "name": "HavenMade",
      "description": "Order Payment",
      "image": "images/home/Logo.png",

      "handler": function (response) {
        
        let orderData = {
          payment_id: response.razorpay_payment_id,
          amount: total,
          cart: cart,
          delivery: deliveryInfo
        };

        localStorage.setItem("lastOrder", JSON.stringify(orderData));

        // -------- EMAIL ORDER TO YOU --------
        fetch("https://formspree.io/f/mwpwgeag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            _subject: "🛒 New Order Received - HavenMade",
            Name: deliveryInfo.name,
            Phone: deliveryInfo.phone,
            Email: deliveryInfo.email,
            Address: `${deliveryInfo.address1}, ${deliveryInfo.address2}, ${deliveryInfo.city}, ${deliveryInfo.state} - ${deliveryInfo.pincode}`,
            Payment_ID: response.razorpay_payment_id,
            Total_Amount: total,
            Items: cart.map(i => `${i.name} × ${i.quantity} — ₹${i.price}`).join("\n"),
          })
        });

        // Clear cart
        localStorage.removeItem("cart");

        // Redirect to thank you page
        window.location.href = "thankyou.html";
      },

      "prefill": {
        "name": name,
        "email": email,
        "contact": phone
      },
      "theme": {
        "color": "#6D9773"
      }
    };

    var rzp = new Razorpay(options);
    rzp.open();
  });
});
