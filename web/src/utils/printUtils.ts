export const printLabel = (orderJob: any, type: 'full' | 'heart', racketObj?: any) => {
  // Extract names for layout
  const fullName = orderJob.customerName || '';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  const dateStr = orderJob.date || orderJob.createdAt || '';
  const shortDate = dateStr ? new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
  const price = orderJob.price ? Number(orderJob.price).toFixed(2) : '0.00';
  
  // Format details
  const rModel = orderJob.racketModel || 'Raquete não def.';
  const rSuffix = racketObj?.identifier ? ` [${racketObj.identifier}]` : '';
  const rPattern = racketObj?.stringPattern || '';
  
  const mains = orderJob.stringMains || orderJob.mainString || 'Não definido';
  const crosses = orderJob.isHybrid ? (orderJob.stringCross || orderJob.crossString || 'Não definido') : mains;
  
  const tMains = `${orderJob.tensionMain || orderJob.tension || '?'} ${orderJob.tensionUnit || 'Lbs'}`;
  const tCrosses = `${orderJob.isHybrid ? (orderJob.tensionCross || orderJob.tension || '?') : (orderJob.tensionMain || orderJob.tension || '?')} ${orderJob.tensionUnit || 'Lbs'}`;
  
  const psMains = orderJob.preStretchMain ? `${orderJob.preStretchMain}%` : 'No';
  const psCrosses = orderJob.preStretchCross ? `${orderJob.preStretchCross}%` : 'No';
  
  let formattedPickup = 'Não definido';
  if (orderJob.pickupDate) {
    try {
      const d = new Date(orderJob.pickupDate);
      const day = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
      const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      formattedPickup = `${day.replace(/^\w/, c => c.toUpperCase())}<br/>${time}`;
    } catch(e) {}
  }

  const hasLogo = orderJob.hasLogo ? 'Yes' : 'No';
  const aux = Array.isArray(orderJob.auxServices) ? orderJob.auxServices : (typeof orderJob.auxServices === 'string' ? JSON.parse(orderJob.auxServices || '[]') : []);
  const hasGrip = aux.some((s:any) => s.isActive && s.type.toLowerCase().includes('grip base')) ? 'Yes' : 'No';
  const hasOvergrip = aux.some((s:any) => s.isActive && s.type.toLowerCase().includes('overgrip')) ? 'Yes' : 'No';
  
  const notes = [orderJob.racketNotes, orderJob.logoNotes, orderJob.pickupNotes, orderJob.notes].filter(Boolean).join(' | ');

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
          <span>Order ${orderJob.orderCode || orderJob.id?.slice(0,8) || ''}</span>
          <span>${shortDate}</span>
        </div>
        <div class="grid">
          <div class="label">Last</div>
          <div class="value-large">${lastName}</div>
          
          <div class="label">First</div>
          <div class="value-large">${firstName}</div>

          <div class="label row-spacing">Racket</div>
          <div class="value-med row-spacing">${rModel}${rSuffix}<br/>${rPattern}</div>

          <div class="label">Pattern</div>
          <div class="value-med">${orderJob.stringingType || 'Standard'}</div>
        </div>

        <div class="tension-row">
          <span>${tMains}</span><span style="font-weight: normal; font-size: 11px;">PS</span><span>${psMains}</span>
        </div>
        <div class="grid">
          <div class="label">Mains</div>
          <div class="string-name">${mains}</div>
        </div>

        <div class="tension-row">
          <span>${tCrosses}</span><span style="font-weight: normal; font-size: 11px;">PS</span><span>${psCrosses}</span>
        </div>
        <div class="grid">
           <div class="label">Crosses</div>
           <div class="string-name">${crosses}</div>
        </div>

        <div class="grid" style="margin-top: 3mm; align-items: flex-start;">
           <div class="label" style="padding-top: 1mm;">Pickup</div>
           <div class="value-large" style="font-size: 15px;">${formattedPickup}</div>
           
           <div class="label">Logo</div><div style="font-weight: 700;">${hasLogo}</div>
           <div class="label">Grip</div><div style="font-weight: 700;">${hasGrip}</div>
           <div class="label">Overgrip</div><div style="font-weight: 700;">${hasOvergrip}</div>
           
           <div class="label row-spacing">Price</div>
           <div class="value-large row-spacing" style="font-size: 16px;">${price} BRL ${orderJob.paid ? '(Paid)' : ''}</div>
           
           <div class="label">Notes</div><div style="font-size: 10px;">${notes}</div>
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
        <div style="font-weight: 800; margin-bottom: 1mm;">${tMains} ${orderJob.isHybrid ? '/ ' + tCrosses : ''}</div>
        <div style="font-size: 9px; margin-bottom: 1mm;">${shortDate} | ${rModel}${rSuffix}</div>
        <div style="font-size: 11px; font-weight: 800;">${lastName} ${firstName}</div>
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
