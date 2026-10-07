const https = require('https');

https.get('https://forms.gle/vQmUZUikRNuJVqie6', (res) => {
  const url = res.statusCode >= 300 && res.statusCode < 400 && res.headers.location ? res.headers.location : 'https://forms.gle/vQmUZUikRNuJVqie6';
  https.get(url, (res2) => {
    let data = '';
    res2.on('data', chunk => data += chunk);
    res2.on('end', () => {
      const match = data.match(/var FB_PUBLIC_LOAD_DATA_ = (\[.*\]);/);
      if (match) {
        const parsed = JSON.parse(match[1]);
        const formId = parsed[14];
        console.log("ACTION_URL: https://docs.google.com/forms/d/e/" + formId + "/formResponse");
        const items = parsed[1][1];
        items.forEach(item => {
          if (item[4]) { // has entry ids
             console.log("Field Title:", item[1]);
             console.log("Entry ID: entry." + item[4][0][0]);
          }
        });
      } else {
        console.log("DATA NOT FOUND. Length of response:", data.length);
        console.log(data.substring(0, 500));
      }
    });
  });
});
