# Project Blueprint

## Overview

This project is a Next.js application that provides a two-step checkout process and a simple dashboard, integrated with the Pushin Pay API for PIX payments.

## Features

### Implemented Features

*   **Two-Step Checkout:**
    *   **Step 1:** Collects user's name, email, and payment amount.
    *   **Step 2:** Generates a real PIX QR code for payment via Pushin Pay.
*   **Dashboard:**
    *   A simple dashboard page with styled cards.
    *   A modern, fixed sidebar with navigation links.
*   **Routing & Styling:**
    *   `/checkout`, `/dashboard` routes.
    *   Styled with Tailwind CSS and `lucide-react` for icons.
*   **Validation:**
    *   Client-side validation for the checkout form.

### Current Plan: Add "Recent Sales" to Dashboard

1.  **Simulate Database:**
    *   Create a `db.json` file to store transaction data.
2.  **Save Transactions:**
    *   After a PIX is created, save the transaction details (ID, name, email, value, date) to `db.json`.
3.  **Implement PIX Status Query:**
    *   Add a `consultarPIX` function to the `pushinpay.ts` module.
4.  **Create `RecentSales` Component:**
    *   Build a new component to display recent sales in a table on the dashboard.
5.  **Automatic Status Check:**
    *   The `RecentSales` component will trigger status checks for transactions.
