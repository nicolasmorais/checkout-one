import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import PurchaseConfirmationEmail from '@/emails/PurchaseConfirmation';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { customerName, customerEmail, orderId, productName, productPrice } = await req.json();

    if (!customerName || !customerEmail || !orderId || !productName || !productPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailHtml = render(
      <PurchaseConfirmationEmail
        customerName={customerName}
        orderId={orderId}
        productName={productName}
        productPrice={productPrice}
      />
    );

    const { data, error } = await resend.emails.send({
      from: 'One Conversion Checkout <onboarding@resend.dev>',
      to: [customerEmail],
      subject: `Confirmação de Compra - Pedido #${orderId}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
