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

        // Read cart & total
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = cart.reduce((sum, item) =>
            sum + item.price * item.quantity, 0
        );

        var options = {
            "key": "rzp_live_RigY3xdQPExOrR", 
            "amount": total * 100,
            "currency": "INR",
            "name": "HavenMade",
            "description": "Order Payment",
            "image": "images/home/Logo.png",

            handler: function (response) {
                localStorage.setItem("lastOrder", JSON.stringify({
                    payment_id: response.razorpay_payment_id,
                    amount: total,
                    cart: cart,
                    delivery: JSON.parse(localStorage.getItem("deliveryDetails"))
                }));

                localStorage.removeItem("cart");

                window.location.href = "thankyou.html";
            },
        };

        var rzp = new Razorpay(options);
        rzp.open();
    });
});
