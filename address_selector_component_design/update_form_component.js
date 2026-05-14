const fs = require('fs');

let content = fs.readFileSync('src/app/location-form/location-form.component.ts', 'utf8');

// Replace addressService references
content = content.replace(/locationEntriesService/g, 'locationListService');

// Replace showEntriesService.postAddress() -> locationListService.addAddress()
content = content.replace(/\.postAddress\(/g, '.addAddress(');

// Replace showEntriesService.updateAddress() -> locationListService.updateAddress()
content = content.replace(/\.updateAddress\(/g, '.updateAddress(');

// Replace locationListService.postAddress(address) -> addAddress
content = content.replace(/locationListService\.postAddress/g, 'locationListService.addAddress');

// Just to be absolutely sure:
content = content.replace(/\.postAddress/g, '.addAddress');
content = content.replace(/\.updateAddress/g, '.updateAddress');
content = content.replace(/\.fetchAddresses/g, '.getAddresses');

fs.writeFileSync('src/app/location-form/location-form.component.ts', content);
