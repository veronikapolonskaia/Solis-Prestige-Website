const escapeHtml = (unsafe) => {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

function formatCurrency(value, currency = 'USD') {
  const number = typeof value === 'string' ? parseFloat(value) : Number(value || 0);
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(number);
  } catch (e) {
    return `$${number.toFixed(2)}`;
  }
}

function renderAddress(address) {
  if (!address) return '';
  const parts = [
    address.firstName && address.lastName ? `${escapeHtml(address.firstName)} ${escapeHtml(address.lastName)}` : escapeHtml(address.customerName),
    escapeHtml(address.address1 || address.street),
    escapeHtml(address.address2),
    [address.city, address.state, address.postalCode || address.zip].filter(Boolean).map(escapeHtml).join(', '),
    escapeHtml(address.country)
  ].filter(Boolean);
  return parts.join('<br/ >');
}

function renderInvoiceHtml(order, company = {}) {
  const { orderNumber, createdAt, currency = 'USD', items = [], subtotal, taxAmount, shippingAmount, discountAmount = 0, total, shippingAddress, billingAddress, user, notes } = order;
  
  // Parse inquiry details from notes
  let inquiry = null;
  if (notes && typeof notes === 'string') {
    try {
      const parsed = JSON.parse(notes);
      if (parsed.type === 'inquiry') {
        inquiry = parsed;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }

  const createdDate = createdAt ? new Date(createdAt) : new Date();

  const itemRows = items.map((item, idx) => {
    const name = escapeHtml(item.productName || item.product?.name || 'Item');
    const variant = item.variantName || item.variant?.name;
    const sku = item.sku || item.variant?.sku || item.product?.sku;
    const qty = Number(item.quantity || 0);
    const price = formatCurrency(item.price, currency);
    const lineTotal = formatCurrency(item.total, currency);
    return `
      <tr>
        <td>${idx + 1}</td>
        <td>
          <div>${name}${variant ? ` — ${escapeHtml(variant)}` : ''}</div>
          ${sku ? `<div class="sku">SKU: ${escapeHtml(sku)}</div>` : ''}
        </td>
        <td class="num">${qty}</td>
        <td class="num">${price}</td>
        <td class="num">${lineTotal}</td>
      </tr>
    `;
  }).join('');

  const companyName = escapeHtml(company.name || 'Your Company');
  const companyEmail = escapeHtml(company.email || 'support@example.com');
  const companyPhone = escapeHtml(company.phone || '');
  const companyAddress = escapeHtml(company.address || '');
  const companyWebsite = escapeHtml(company.website || '');
  const companyTagline = escapeHtml(company.tagline || '');

  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${escapeHtml(orderNumber)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; color: #111827; margin: 0; padding: 24px; background: #ffffff; }
    .container { max-width: 800px; margin: 0 auto; background: white; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding: 24px; border-bottom: 2px solid #e5e7eb; }
    .brand { font-weight: 800; font-size: 28px; letter-spacing: .2px; color: #111827; }
    .muted { color: #6b7280; }
    .badge { background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    h1 { font-size: 24px; margin: 0 0 8px; color: #111827; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left; vertical-align: top; }
    th { background: #f9fafb; color: #374151; font-weight: 600; }
    .num { text-align: right; white-space: nowrap; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0 24px; }
    .section-title { font-weight: 600; margin-bottom: 8px; color: #374151; }
    .totals { margin-top: 12px; }
    .totals table { width: auto; margin-left: auto; }
    .sku { color: #6b7280; font-size: 12px; margin-top: 2px; }
    .footer { margin-top: 24px; font-size: 12px; color: #6b7280; }
    .logo { height: 60px; margin-bottom: 16px; }
    .inquiry-section { background: #f9fafb; padding: 20px; margin: 0 0 24px; border: 1px solid #e5e7eb; }
    .inquiry-title { color: #374151; font-size: 18px; font-weight: 700; margin-bottom: 16px; }
    .inquiry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px; }
    .inquiry-item { background: #ffffff; padding: 8px 12px; border: 1px solid #e5e7eb; }
    .inquiry-label { font-weight: 600; color: #374151; }
  </style>
  <base target="_blank" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;">
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        ${(() => {
          try {
            const fs = require('fs');
            const path = require('path');
            const logoPath = path.join(__dirname, '../../frontend/public/deluxe-soiree-logo.svg');
            const logoData = fs.readFileSync(logoPath);
            return `<img src="data:image/svg+xml;base64,${logoData.toString('base64')}" alt="Deluxe Soirée Logo" class="logo" />`;
          } catch (error) {
            console.log('Logo not found, using text fallback');
            return `<div style="font-size: 32px; font-weight: bold; color: #F0C946; margin-bottom: 16px;">🎉 Deluxe Soirée</div>`;
          }
        })()}
        <div class="brand">Deluxe Soirée</div>
        <div class="muted">Event Inquiry Invoice</div>
        ${companyTagline ? `<div class="muted" style="margin-top:4px; font-style: italic;">${companyTagline}</div>` : ''}
        <div class="muted" style="margin-top:6px; font-size:12px; line-height:1.45">
          ${companyAddress ? `${companyAddress}<br/>` : ''}
          ${companyPhone ? `Phone: ${companyPhone}<br/>` : ''}
          ${companyEmail ? `Email: ${companyEmail}<br/>` : ''}
          ${companyWebsite ? `${companyWebsite}` : ''}
        </div>
      </div>
      <div class="muted" style="text-align:right">
        <div><span class="badge">#${escapeHtml(orderNumber)}</span></div>
        <div>Created: ${createdDate.toLocaleDateString()}</div>
        ${user?.email ? `<div>Customer: ${escapeHtml(user.email)}</div>` : ''}
      </div>
    </div>

    ${inquiry ? `
    <div class="inquiry-section">
      <div class="inquiry-title">Event Inquiry Details</div>
      <div class="inquiry-grid">
        <div class="inquiry-item"><span class="inquiry-label">Event Type:</span> ${escapeHtml(inquiry.eventType || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Event Date:</span> ${escapeHtml(inquiry.eventDate || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Start Time:</span> ${escapeHtml(inquiry.eventStartTime || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Location Type:</span> ${escapeHtml(inquiry.eventLocationType || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Full Address:</span> ${escapeHtml(inquiry.eventFullAddress || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Preferred Language:</span> ${escapeHtml(inquiry.preferredLanguage || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Environment:</span> ${escapeHtml(inquiry.eventEnvironment || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Venue Details:</span> ${escapeHtml(inquiry.venueDetails || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Guest Age Range:</span> ${escapeHtml(inquiry.guestAgeRange || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Number of Guests:</span> ${escapeHtml(inquiry.numberOfGuests || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Party Theme:</span> ${escapeHtml(inquiry.partyTheme || 'N/A')}</div>
        <div class="inquiry-item"><span class="inquiry-label">Working with Planner:</span> ${escapeHtml(inquiry.workingWithPlanner || 'N/A')}</div>
        ${inquiry.packageInterest && inquiry.packageInterest.length > 0 ? `<div class="inquiry-item"><span class="inquiry-label">Package Interest:</span> ${escapeHtml(inquiry.packageInterest.join(', '))}</div>` : ''}
        ${inquiry.productIds && inquiry.productIds.length > 0 ? `<div class="inquiry-item"><span class="inquiry-label">Selected Products:</span> ${inquiry.productIds.length} product(s)</div>` : ''}
        ${inquiry.notes ? `<div class="inquiry-item"><span class="inquiry-label">Additional Notes:</span> ${escapeHtml(inquiry.notes)}</div>` : ''}
      </div>
    </div>
    ` : ''}

    <div class="content">
      <div class="grid">
        <div>
          <div class="section-title">Contact Information</div>
          <div class="muted">
            ${inquiry?.contact?.name ? `<strong>Name:</strong> ${escapeHtml(inquiry.contact.name)}<br/>` : ''}
            ${inquiry?.contact?.email ? `<strong>Email:</strong> ${escapeHtml(inquiry.contact.email)}<br/>` : ''}
            ${inquiry?.contact?.phone ? `<strong>Phone:</strong> ${escapeHtml(inquiry.contact.phone)}<br/>` : ''}
            ${inquiry?.eventFullAddress ? `<strong>Event Address:</strong> ${escapeHtml(inquiry.eventFullAddress)}` : ''}
          </div>
        </div>
        <div>
          <div class="section-title">Event Location</div>
          <div class="muted">
            ${inquiry?.eventLocationType ? `<strong>Location Type:</strong> ${escapeHtml(inquiry.eventLocationType)}<br/>` : ''}
            ${inquiry?.eventFullAddress ? `<strong>Full Address:</strong> ${escapeHtml(inquiry.eventFullAddress)}<br/>` : ''}
            ${inquiry?.venueDetails ? `<strong>Venue Details:</strong> ${escapeHtml(inquiry.venueDetails)}` : ''}
          </div>
        </div>
      </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th class="num">Qty</th>
          <th class="num">Price</th>
          <th class="num">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div class="totals">
      <table>
        <tr><td class="muted">Subtotal</td><td class="num">${formatCurrency(subtotal, currency)}</td></tr>
        <tr><td class="muted">Tax</td><td class="num">${formatCurrency(taxAmount, currency)}</td></tr>
        <tr><td class="muted">Shipping</td><td class="num">${formatCurrency(shippingAmount, currency)}</td></tr>
        ${Number(discountAmount) ? `<tr><td class="muted">Discount</td><td class="num">- ${formatCurrency(discountAmount, currency)}</td></tr>` : ''}
        <tr><td><strong>Total</strong></td><td class="num"><strong>${formatCurrency(total, currency)}</strong></td></tr>
      </table>
    </div>

        <div class="footer">
          <div style="text-align: center; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; margin-top: 20px;">
            <h3 style="color: #374151; margin: 0 0 10px;">Thank you for your inquiry!</h3>
            <p style="margin: 0; font-size: 14px; color: #6b7280;">We're excited to help make your event extraordinary. Our team will contact you soon to discuss your celebration!</p>
          </div>
        </div>
    </div>
  </div>
</body>
</html>
`;
}

module.exports = { renderInvoiceHtml };


