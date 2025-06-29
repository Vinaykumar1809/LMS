import { useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import { verifyUserPayment } from "../../Redux/Slices/StripeSlice";
import { getUserData } from "../../Redux/Slices/AuthSlice";
import toast from "react-hot-toast";

function CheckoutSuccess() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verify = async () => {
      if (sessionId) {
         const res = await dispatch(verifyUserPayment({ session_id: sessionId }));
        if (res?.payload?.success) {
          toast.success("Subscription activated!");
          dispatch(getUserData()); // refresh user status
        } else {
          toast.error("Could not verify payment.");
        }
      }
    };
    verify();
  }, [dispatch, sessionId]);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex items-center justify-center text-white">
        <div className="w-80 h-[26rem] flex flex-col justify-center items-center shadow-[0_0_10px_black] rounded-lg relative">
          <h1 className="bg-green-500 absolute text-center top-0 w-full py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">
            Payment Successful
          </h1>

          <div className="px-4 flex flex-col items-center justify-center space-y-2">
            <h2 className="text-lg font-semibold">Welcome to the Pro Bundle</h2>
            <p className="text-center">Now you can access all our courses and book collections</p>
            <AiFillCheckCircle className="text-green-500 text-5xl" />
          </div>

          <Link
            to="/"
            className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full py-2 text-xl font-semibold text-center rounded-br-lg rounded-bl-lg"
          >
            <button>Go to Dashboard</button>
          </Link>
        </div>
      </div>
    </HomeLayout>
  );
}

export default CheckoutSuccess;
