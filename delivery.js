document.addEventListener("DOMContentLoaded", () => {

    const payBtn = document.getElementById("proceedToPay");

    if (!payBtn) {
        console.error("❌ Button not found: proceedToPay");
        return;
    }

    payBtn.addEventListener("click", function () {

        // Collect form values
        let name = document.getElementById("fullName").value.trim();
        let phone = document.getElementById("phoneNumber").value.trim();
        let email = document.getElementById("emailAddress").value.trim();
        let add1 = document.getElementById("address1").value.trim();
        let city = document.getElementById("city").value.trim();
        let state = document.getElementById("state").value.trim();
        let pin = document.getElementById("pincode").value.trim();

        // Simple validation
        if (!name || !phone || !email || !add1 || !city || !state || !pin) {
            alert("Please fill all required fields.");
            return;
        }

        // SAVE delivery details
        localStorage.setItem("deliveryDetails", JSON.stringify({
            name, phone, email, add1, city, state, pin
        }));
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
