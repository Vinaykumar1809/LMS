import { useEffect } from "react";
import toast from "react-hot-toast";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

import HomeLayout from '../../Layouts/HomeLayout';
import {
  getStripeKey,
  purchaseCourseBundle,
  verifyUserPayment
} from "../../Redux/Slices/StripeSlice"; // You can rename this slice later

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

async function handleSubscription(e) {
  e.preventDefault();

  // 1. Load Stripe Key and Session
  const keyRes = await dispatch(getStripeKey());
  const sessionRes = await dispatch(purchaseCourseBundle());

  const stripeKey = keyRes?.payload?.key;
  const sessionId = sessionRes?.payload?.sessionId;

  if (!stripeKey || !sessionId) {
    toast.error("Unable to initiate checkout");
    return;
  }

  // 2. Load Stripe
  const stripe = await loadStripe(stripeKey);

  // 3. Redirect to Stripe Checkout
  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    toast.error(error.message);
  }
}


  async function load() {
    await dispatch( getStripeKey());
    await dispatch(purchaseCourseBundle());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <HomeLayout>
      <form
        onSubmit={handleSubscription}
        className="min-h-[90vh] flex items-center justify-center text-white"
      >
        <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
          <h1 className="bg-yellow-500 absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl0lg rounded-tr-lg">Subscription Bundle</h1>
          <div className="px-4 space-y-5 text-center">
            <p className="text-[17px]">
              This purchase will allow you to access all available course
              of our platform for{" "}
              <span className="text-yellow-500 font-bold">
                <br />
                1 Year duration
              </span>{" "}
              All the existing and new launched courses will be also available
            </p>

            <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
              <BiRupee /><span>499</span> only
            </p>
            <div className="text-gray-200">
              <p>100% refund on cancellation</p>
              <p>* Terms and conditions applied *</p>
            </div>
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full left-0 text-xl font-bold rounded-bl-lg rounded-br-lg py-2"
            >
              Buy now
            </button>
          </div>
        </div>
      </form>
    </HomeLayout>
  );
}

export default Checkout;
