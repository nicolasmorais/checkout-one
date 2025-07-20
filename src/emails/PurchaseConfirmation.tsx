import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface PurchaseConfirmationEmailProps {
  customerName: string;
  orderId: string;
  productName: string;
  productPrice: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const PurchaseConfirmationEmail = ({
  customerName,
  orderId,
  productName,
  productPrice,
}: PurchaseConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirmação de Compra - One Conversion Checkout</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${baseUrl}/static/logo.png`}
            width="120"
            height="50"
            alt="One Conversion Checkout"
          />
        </Section>
        <Heading style={h1}>Obrigado pela sua compra!</Heading>
        <Text style={text}>
          Olá {customerName},
        </Text>
        <Text style={text}>
          Seu pedido foi confirmado com sucesso. Estamos preparando tudo para você.
          Abaixo estão os detalhes da sua compra:
        </Text>
        <Section style={detailsContainer}>
            <Row>
                <Column style={detailsTitle}>Pedido ID:</Column>
                <Column style={detailsValue}>{orderId}</Column>
            </Row>
            <Row>
                <Column style={detailsTitle}>Produto:</Column>
                <Column style={detailsValue}>{productName}</Column>
            </Row>
            <Row>
                <Column style={detailsTitle}>Preço Total:</Column>
                <Column style={detailsValue}>{productPrice}</Column>
            </Row>
        </Section>
        <Text style={text}>
          Se tiver alguma dúvida, responda a este e-mail. Estamos aqui para ajudar!
        </Text>
        <Section style={footer}>
          <Link href={baseUrl} style={footerLink}>oneconversioncheckout.com</Link>
          <Text style={footerText}>
            © 2024 One Conversion Checkout. Todos os direitos reservados.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PurchaseConfirmationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
};

const logoContainer = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0 20px",
};

const text = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "left" as const,
  padding: "0 40px",
};

const detailsContainer = {
    padding: "0 40px",
    margin: "20px 0",
    borderTop: "1px solid #e6ebf1",
    borderBottom: "1px solid #e6ebf1",
};

const detailsTitle = {
    fontSize: "14px",
    fontWeight: "bold",
    padding: "10px 0",
    color: "#333",
}

const detailsValue = {
    fontSize: "14px",
    padding: "10px 0",
    color: "#555",
    textAlign: "right" as const,
}

const footer = {
  padding: "0 20px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const footerLink = {
    color: "#8898aa",
    textDecoration: "underline",
}
