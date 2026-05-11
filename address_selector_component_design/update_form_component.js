const fs = require('fs');

let content = fs.readFileSync('src/app/location-form/location-form.component.ts', 'utf8');

// Replace addressService references
content = content.replace(/locationEntriesService/g, 'locationListService');

// Replace showEntriesService.postEntry() -> locationListService.addAddress()
content = content.replace(/\.postEntry\(/g, '.addAddress(');

// Replace showEntriesService.updateEntry() -> locationListService.updateAddress()
content = content.replace(/\.updateEntry\(/g, '.updateAddress(');

// Replace locationListService.postEntry(selectedAddress) -> addAddress
content = content.replace(/locationListService\.postEntry/g, 'locationListService.addAddress');

// Just to be absolutely sure:
content = content.replace(/\.postEntry/g, '.addAddress');
content = content.replace(/\.updateEntry/g, '.updateAddress');
content = content.replace(/\.fetchAddresses/g, '.getAddresses');

fs.writeFileSync('src/app/location-form/location-form.component.ts', content);
