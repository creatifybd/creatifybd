const chunks = ['leads_1.json', 'leads_2.json', 'leads_3.json', 'leads_4.json', 'leads_5.json'];
Promise.all(chunks.map(f =>
  fetch('https://creatifybd.com/data/' + f)
    .then(r => r.text())
    .then(text => {
      const sanitized = text.replace(/:\s*NaN\b/g, ':""');
      const data = JSON.parse(sanitized);
      const s = data[0];
      console.log(f + ': OK - ' + data.length + ' records. Sample: ' + s.business_name + ', ' + s.city + ', ' + s.country);
      return data.length;
    })
)).then(counts => {
  const total = counts.reduce((a, b) => a + b, 0);
  console.log('TOTAL LEADS FROM LIVE SERVER:', total, '/ 51090');
}).catch(err => console.error('ERROR:', err.message));
