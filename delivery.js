document.getElementById("razorpay-checkout-btn").addEventListener("click", function (e) {
    e.preventDefault();

    // Collect delivery details
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address1 = document.getElementById("address1").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    // Validation
    if (!fullName || !phone || !email || !address1 || !city || !state || !pincode) {
        alert("Please fill all required details.");
        return;
    }

    if (phone.length !== 10) {
        alert("Invalid phone number.");
        return;
    }

    if (pincode.length !== 6) {
        alert("Invalid pincode.");
        return;
    }

    // Save delivery info
    const deliveryData = {
        fullName,
        phone,
        email,
        address1,
        address2: document.getElementById("address2").value.trim(),
        city,
        state,
        pincode
    };
    localStorage.setItem("deliveryInfo", JSON.stringify(deliveryData));

    // Load cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Razorpay Options
    var options = {
        "key": "rzp_live_RigY3xdQPExOrR",
        "amount": total * 100,
        "currency": "INR",
        "name": "HavenMade",
        "description": "Order Payment",
        "image": "images/home/Logo.png",

        "prefill": {
            "name": fullName,
            "email": email,
            "contact": phone
        },

        "theme": { "color": "#6D9773" },

        "handler": function (response) {

            // Save order data + delivery details
            const orderData = {
                payment_id: response.razorpay_payment_id,
                amount: total,
                cart: cart,
                delivery: deliveryData
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
            
            localStorage.removeItem("cart");

            // Redirect
            window.location.href = "thankyou.html";
        }
    };

    var rzp = new Razorpay(options);
    rzp.open();
});
