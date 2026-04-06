var e=(e,t)=>{let n=(e.customerName||``).split(` `),r=n[0]||``,i=n.length>1?n[n.length-1]:``,a=e.date||``,o=a.slice(0,5),s=e.price?e.price.toFixed(2):`120.00`,c=e.tension||`52 lbs`,l=``;l=t===`full`?`
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
          <span>Order ${e.id||`2E0z8HK5`} - <b>1 of 1</b></span>
          <span>${a}</span>
        </div>
        <div class="grid">
          <div class="label">Last</div>
          <div class="value-large">${i}</div>
          
          <div class="label">First</div>
          <div class="value-large">${r}</div>

          <div class="label row-spacing">Racket</div>
          <div class="value-med row-spacing">${e.racketModel||`Head Speed Pro`} [1]<br/>18x20</div>

          <div class="label">Pattern</div>
          <div class="value-med">ATW</div>
        </div>

        <div class="tension-row">
          <span>${c}</span><span style="font-weight: normal; font-size: 11px;">PS</span><span>No</span>
        </div>
        <div class="grid">
          <div class="label">Mains</div>
          <div class="string-name">Solinco Hyper-G<br/>Green 115</div>
        </div>

        <div class="tension-row">
          <span>${c}</span><span style="font-weight: normal; font-size: 11px;">PS</span><span>No</span>
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
           <div class="value-large row-spacing" style="font-size: 16px;">${s} BRL ${e.paid?`(Paid)`:``}</div>
           
           <div class="label">Notes</div><div></div>
        </div>
        
        <script>
          window.onload = function() { window.print(); window.close(); }
        <\/script>
      </body>
      </html>
    `:`
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
        <div>${o} ${c} / ${c}</div>
        <div>${i} ${r}</div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        <\/script>
      </body>
      </html>
    `;let u=window.open(``,`_blank`,`width=400,height=600`);u&&(u.document.open(),u.document.write(l),u.document.close())};export{e as printLabel};