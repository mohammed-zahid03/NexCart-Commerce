package com.ecommerce.project.service;

import com.ecommerce.project.payload.StripePaymentDto;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface StripeService {

    PaymentIntent paymentIntent(StripePaymentDto stripePaymentDto) throws StripeException;

    PaymentIntent verifyPayment(String paymentIntentId) throws StripeException;

    void refundPayment(String paymentIntentId) throws StripeException;
}
