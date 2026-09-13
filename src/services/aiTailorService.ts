import { GoogleGenAI } from '@google/genai';

export interface TailorReplyContext {
  customerMessage: string;
  tailorShop?: string;
  tailorName?: string;
  garmentType?: string;
  orderId?: string;
  orderStatus?: string;
  requirements?: string;
  measurements?: Record<string, any>;
}

/**
 * Intelligent domain-specific tailoring responses based on intent keywords.
 * Used as an ultra-reliable zero-latency fallback or offline engine.
 */
function getIntelligentFallbackReply(ctx: TailorReplyContext): string {
  const msg = ctx.customerMessage.toLowerCase();
  const shop = ctx.tailorShop || 'Lakshmi Stitching Studio';
  const tailor = ctx.tailorName || 'Master Lakshmi';
  const garment = ctx.garmentType || 'garment';

  // 1. Sleeve / Length / Margins
  if (msg.includes('sleeve') || msg.includes('length') || msg.includes('margin') || msg.includes('armhole') || msg.includes('tight') || msg.includes('loose')) {
    return `Hello! This is ${tailor} from ${shop}. I have noted your adjustments for the ${garment}. We always keep a generous 2-inch inner seam allowance so we can easily adjust the sleeves and waist during your trial fitting!`;
  }

  // 2. Neckline / Deep / Boat neck / Design
  if (msg.includes('neck') || msg.includes('boat') || msg.includes('pot') || msg.includes('backless') || msg.includes('collar') || msg.includes('design') || msg.includes('piping')) {
    return `Namaste! Yes, we can certainly sculpt that neckline style. I will use matching golden cord piping along the neck curve and ensure the front and back drops maintain perfect shoulder grip without slipping.`;
  }

  // 3. Lining / Fabric / Material
  if (msg.includes('lining') || msg.includes('fabric') || msg.includes('cloth') || msg.includes('cotton') || msg.includes('crepe') || msg.includes('silk') || msg.includes('padding')) {
    return `For this ${garment}, we use premium pre-shrunk 100% cotton lining so there is zero shrinkage after washing. We also provide breathable padded cups if you prefer Prince-cut styling.`;
  }

  // 4. Delivery / Ready date / Urgency / Time
  if (msg.includes('when') || msg.includes('ready') || msg.includes('deliver') || msg.includes('time') || msg.includes('date') || msg.includes('urgent') || msg.includes('fast') || msg.includes('status')) {
    const statusNote = ctx.orderStatus ? `currently in the ${ctx.orderStatus} stage` : 'in our active workshop queue';
    return `Your order #${ctx.orderId || 'LTC-10482'} is ${statusNote}. We are on schedule to have it pressed, finished, and ready for your trial fitting by tomorrow evening!`;
  }

  // 5. Pricing / Cost / Quotation / Discount / Rates
  if (msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('quote') || msg.includes('discount') || msg.includes('how much') || msg.includes('pay')) {
    return `Our pricing is completely itemized and transparent. Base stitching starts at the agreed rate, and any additional aari embroidery or hand-piping is pre-approved with you before we cut. Zero hidden charges!`;
  }

  // 6. Alteration / Fix / Issue
  if (msg.includes('alter') || msg.includes('fit') || msg.includes('change') || msg.includes('adjust') || msg.includes('redo')) {
    return `Do not worry at all! Under our 100% Fit Guarantee, any fitting adjustments or alteration tweaks within 7 days are completely free of charge. You can come by for a trial or we can arrange doorstep pickup.`;
  }

  // 7. Contextual default based on tailor
  return `Namaste from ${shop}! Thank you for your note regarding your ${garment}. Master ${tailor} has reviewed your specifications and added them directly to your order workshop ticket. Let us know if you need anything else!`;
}

/**
 * Generates a dynamic, contextual response from the master tailor.
 * Attempts to use Google Gemini AI via GEMINI_API_KEY, and gracefully
 * falls back to the intelligent domain-specific tailor engine.
 */
export async function generateTailorAIResponse(ctx: TailorReplyContext): Promise<string> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    '';

  if (!apiKey || apiKey.trim() === '') {
    return getIntelligentFallbackReply(ctx);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are the master artisan and owner of "${ctx.tailorShop || 'Lakshmi Stitching Studio'}", a high-end bespoke tailoring atelier in Tamil Nadu, India.
Your name is ${ctx.tailorName || 'Master Lakshmi'}.

The customer just sent this message regarding their bespoke order (#${ctx.orderId || 'LTC-10482'}, Garment: ${ctx.garmentType || 'Bespoke Garment'}, Current Stage: ${ctx.orderStatus || 'Stitching'}):
"${ctx.customerMessage}"

Requirements on file: "${ctx.requirements || 'Custom tailored with perfect fit'}"

Respond to the customer in 1 to 3 warm, professional, authentic sentences. Speak like an experienced Indian master tailor who cares deeply about perfect craftsmanship, comfort, neckline elegance, seam allowances, and on-time delivery. Do NOT use markdown asterisks or robotic AI language.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text && text.length > 5) {
      return text;
    }
  } catch (err) {
    console.warn('[AI Tailor Service] Gemini API call fallback to domain engine:', err);
  }

  // Guaranteed contextual fallback if API call fails or times out
  return getIntelligentFallbackReply(ctx);
}
