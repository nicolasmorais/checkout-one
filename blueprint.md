# Project Blueprint

## Overview

This project is a Next.js application that provides a two-step checkout process and a simple dashboard, integrated with the Pushin Pay API for PIX payments.

## Features

### Implemented Features

*   **PIX Payment Integration:** Generates real PIX QR codes via Pushin Pay.
*   **Dynamic Dashboard:** Displays real-time statistics and a list of recent sales from a Vercel KV database.
*   **Live Status Check:** Allows real-time checking of PIX payment status.

### Current Plan: Redesign Checkout Page

**Objective:** Replicate the provided design screenshot exactly.

1.  **Top Bar:**
    *   Implement a green top bar with a countdown timer.
2.  **Main Form Card:**
    *   Recreate the white card layout.
    *   Add the "One Conversion" logo.
    *   Display "Acesso Exclusivo - Plano Vitalício" with the price of R$ 1,50.
    *   Style the "Nome Completo" and "Email" input fields to match the design.
    *   Style the main green call-to-action button ("Ir para pagamento").
    *   Add the "Ambiente seguro" text with a shield icon.
    *   **Update payment value to 150 cents.**
3.  **Testimonials Section:**
    *   Create a "O que nossos clientes dizem" section.
    *   Implement testimonial cards with avatars, names, star ratings, and text.
4.  **Footer Section:**
    *   Create a custom footer for the checkout page.
    *   Include company details (CNPJ).
    *   Include a "Pagamento Seguro" block with a lock icon.
5.  **Componentization:**
    *   Break down the new design into clean, reusable components.
