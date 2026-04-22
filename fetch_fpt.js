const https = require('https');
https.get('https://fptshop.com.vn', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = data.match(/https?:\/\/[^\s"'><]+(?:png|svg|jpg|webp)/gi);
    if(urls) {
        console.log(urls.filter(u => u.includes('pay') || u.includes('visa') || u.includes('master') || u.includes('logo') || u.includes('icon')).join('\n'));
    }
  });
});
