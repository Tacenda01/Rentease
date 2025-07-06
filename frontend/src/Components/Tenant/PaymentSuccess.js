import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
    const [status, setStatus] = useState("Verifying payment...");
    const [countdown, setCountdown] = useState(5);
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const startCountdown = useCallback(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    navigate("/tenant/search");
                }
                return prev - 1;
            });
        }, 1000);
    }, [navigate]);

    useEffect(() => {
        const txnId = params.get("session_id");

        if (!txnId) {
            setStatus("Invalid or missing session ID.");
            startCountdown();
            return;
        }

        const verifyPayment = async () => {
            try {
                const paymentRes = await axios.get(`http://localhost:5000/api/payment/status/${txnId}`);

                if (paymentRes.data.success && paymentRes.data.code === "PAYMENT_SUCCESS") {
                    setStatus("Payment Successful and Booking Confirmed!");
                    localStorage.removeItem("pendingBooking");
                } else {
                    setStatus("Payment Failed.");
                }
            } catch (err) {
                console.error(err);
                setStatus("Error verifying payment.");
            } finally {
                startCountdown();
            }
        };

        verifyPayment();
    }, [params, startCountdown]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{status}</h2>
            {countdown > 0 && (
                <p>
                    Redirecting to property listings in {countdown} second{countdown > 1 ? "s" : ""}...
                </p>
            )}
        </div>
    );
}
