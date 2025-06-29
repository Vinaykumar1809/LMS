import {Router} from 'express';
import { getPaymentApikey,buySubscription,verifySubscription,cancelSubscription,allPayments } from '../controllers/payment.controller.js';
import {authorizedRoles,authorizeSubscriber,isLoggedIn} from '../middlewares/auth.middleware.js';
const router = Router();

router
  .route('/stripe-key')
  .get(
    isLoggedIn,
    getPaymentApikey
     );

  router
    .route('/subscribe')
    .post(
         isLoggedIn,
        buySubscription
    );

  router
    .route('/verify')
    .post(
         isLoggedIn,
        verifySubscription
    );

  router
    .route('/unsubscribe')
    .post(
         isLoggedIn,authorizeSubscriber,
        cancelSubscription
    );


 router
   .route('/')
   .get(
     isLoggedIn,
     authorizedRoles('ADMIN'),
    allPayments
          );




export default router;