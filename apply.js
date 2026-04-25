const fs = require('fs');

const addMaskToSetState = (filePath, stateSetterName) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('applyPhoneMask')) {
    // import at the top
    content = content.replace(/(import React.*)/, "$1\nimport { applyPhoneMask } from '../utils/masks';");
  }
  // replace setPhone(e.target.value) with setPhone(applyPhoneMask(e.target.value))
  // We should be careful regex
  const regex = new RegExp(stateSetterName + "\\(e\\.target\\.value\\)", "g");
  content = content.replace(regex, stateSetterName + "(applyPhoneMask(e.target.value))");
  fs.writeFileSync(filePath, content);
};

// ProfileSettingsModal.tsx
addMaskToSetState('web/src/components/ProfileSettingsModal.tsx', 'setPhone');

// LoginView.tsx
addMaskToSetState('web/src/components/LoginView.tsx', 'setRegisterPhone');

// UserManagement.tsx
let umContent = fs.readFileSync('web/src/components/UserManagement.tsx', 'utf8');
if (!umContent.includes('applyPhoneMask')) {
  umContent = umContent.replace(/(import React.*)/, "$1\nimport { applyPhoneMask } from '../utils/masks';");
}
umContent = umContent.replace(/setUserData\(\{\s*\.\.\.userData,\s*phone:\s*e\.target\.value\s*\}\)/g, "setUserData({ ...userData, phone: applyPhoneMask(e.target.value) })");
fs.writeFileSync('web/src/components/UserManagement.tsx', umContent);

console.log('Masks applied!');
