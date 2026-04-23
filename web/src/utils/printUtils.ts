export const printLabel = (orderJob: any, type: 'full' | 'heart') => {
  // Extract names for layout
  const fullName = orderJob.customerName || '';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  const dateStr = orderJob.date || '';
  const shortDate = dateStr.slice(0, 5); // Assuming DD/MM/YYYY
  const price = orderJob.price ? orderJob.price.toFixed(2) : '120.00';
  const tension = orderJob.tension || '52 lbs';

  let htmlContent = '';

  if (type === 'full') {
    htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Label</title>
        <style>
          @page { margin: 0; size: 62mm auto; }
          body { 
            margin: 0; 
            padding: 2mm 3mm; 
            font-family: Arial, Helvetica, sans-serif; 
            color: black; 
            background: white;
            width: 58mm; /* 62mm minus some padding */
            box-sizing: border-box;
          }
          .header { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2mm; }
          .grid { display: grid; grid-template-columns: 14mm 1fr; align-items: baseline; gap: 1mm; font-size: 13px; line-height: 1.1; }
          .label { font-size: 11px; font-weight: normal; }
          .value-large { font-size: 18px; font-weight: 900; }
          .value-med { font-size: 12px; font-weight: 800; }
          .row-spacing { margin-top: 1mm; margin-bottom: 1mm; }
          .tension-row { display: flex; justify-content: space-between; font-weight: 900; font-size: 14px; margin-top: 1mm;}
          .string-name { font-weight: 900; font-size: 14px; line-height: 1.1; }
        </style>
      </head>
      <body>
        <div class="header">
          <span>Order ${orderJob.id || '2E0z8HK5'} - <b>1 of 1</b></span>
          <span>${dateStr}</span>
        </div>
        <div class="grid">
          <div class="label">Last</div>
          <div class="value-large">${lastName}</div>
          
          <div class="label">First</div>
          <div class="value-large">${firstName}</div>

          <div class="label row-spacing">Racket</div>
          <div class="value-med row-spacing">${orderJob.racketModel || 'Head Speed Pro'} [1]<br/>18x20</div>

          <div class="label">Pattern</div>
          <div class="value-med">ATW</div>
        </div>

        <div class="tension-row">
          <span>${tension}</span><span style="font-weight: normal; font-size: 11px;">PS</span><span>No</span>
        </div>
        <div class="grid">
          <div class="label">Mains</div>
          <div class="string-name">Solinco Hyper-G<br/>Green 115</div>
        </div>

        <div class="tension-row">
          <span>${tension}</span><span style="font-weight: normal; font-size: 11px;">PS</span><span>No</span>
        </div>
        <div class="grid">
           <div class="label">Crosses</div>
           <div class="string-name">Solinco Hyper-G<br/>Green 115</div>
        </div>

        <div class="grid" style="margin-top: 3mm; align-items: flex-start;">
           <div class="label" style="padding-top: 1mm;">Pickup</div>
           <div class="value-large" style="font-size: 16px;">Sábado 4 Abril<br/>2026 12:30</div>
           
           <div class="label">Logo</div><div>No</div>
           <div class="label">Grip</div><div>No</div>
           <div class="label">Overgrip</div><div>No</div>
           
           <div class="label row-spacing">Price</div>
           <div class="value-large row-spacing" style="font-size: 16px;">${price} BRL ${orderJob.paid ? '(Paid)' : ''}</div>
           
           <div class="label">Notes</div><div></div>
        </div>
        
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
      </html>
    `;
  } else {
    // Heart Label (Small format: usually 12mm x 50mm, throat label)
    htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Heart Label</title>
        <style>
          @page { margin: 0; size: 50mm 15mm; }
          body { 
            margin: 0; 
            padding: 1mm; 
            font-family: Arial, Helvetica, sans-serif; 
            color: black; 
            background: white;
            font-size: 10px;
            font-weight: normal;
          }
        </style>
      </head>
      <body>
        <div>${shortDate} ${tension} / ${tension}</div>
        <div>${lastName} ${firstName}</div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
      </html>
    `;
  }

  // Open hidden print window
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};
