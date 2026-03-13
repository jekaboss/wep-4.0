const fs = require('fs');
const html = fs.readFileSync('c:/Users/женя/Desktop/wep-2.0/wep-2.0-main/cheatsheet.html', 'utf8');
console.log('File size:', html.length, 'chars');
console.log('Has DOCTYPE:', html.includes('<!doctype html>'));
console.log('Has closing html:', html.includes('</html>'));
console.log('Has closing body:', html.includes('</body>'));
console.log('Has closing script:', html.includes('</script>'));
