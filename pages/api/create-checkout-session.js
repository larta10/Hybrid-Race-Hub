import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { answers, email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email inválido" });
  }
  if (!answers?.objective || !answers?.level) {
    return res.status(400).json({ error: "Datos del plan incompletos" });
  }

  try {
    const metadata = {
      email,
      objective:    String(answers.objective   || ""),
      level:        String(answers.level        || ""),
      daysPerWeek:  String(answers.daysPerWeek  || 4),
      horizonWeeks: String(answers.horizon?.weeks || 8),
      horizonLabel: String(answers.horizon?.label || ""),
      equipment:    String(answers.equipment    || ""),
      weaknesses:   String((answers.weaknesses  || []).join(",")),
      edad:         String(answers.edad   || ""),
      peso:         String(answers.peso   || ""),
      altura:       String(answers.altura || ""),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Plan de Entrenamiento — Excel Personalizado",
            description: "Rutina completa con seguimiento de pesos, progreso semanal y registro corporal.",
          },
          unit_amount: 299,
        },
        quantity: 1,
      }],
      mode: "payment",
      customer_email: email,
      metadata,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/plan-descargado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/plan-entrenamiento`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: "Error al crear la sesión de pago" });
  }
}
