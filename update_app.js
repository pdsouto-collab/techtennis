const fs = require('fs');
let code = fs.readFileSync('web/src/App.tsx', 'utf8');

if (!code.includes('import { ProfileSettingsModal }')) {
  code = code.replace(
    "import { Settings } from './components/Settings';",
    "import { Settings } from './components/Settings';\nimport { ProfileSettingsModal } from './components/ProfileSettingsModal';"
  );
}

if (!code.includes('const [isProfileOpen, setIsProfileOpen] = useState(false);')) {
  code = code.replace(
    'const AppContent = () => {',
    'const AppContent = () => {\n  const [isProfileOpen, setIsProfileOpen] = useState(false);'
  );
}

if (!code.includes('onClick={() => { setIsProfileOpen(true); setShowUserMenu(false); }}')) {
  const oldMenu = `                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden', minWidth: '150px', zIndex: 100 }}>
                  <button onClick={() => {}} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #eee', fontWeight: 600, fontSize: '13px' }}>
                    Trocar Senha
                  </button>
                  <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#EF4444', fontWeight: 600, fontSize: '13px' }}>
                    Sair (Logout)
                  </button>
                </div>`;
                
  const newMenu = `                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden', minWidth: '150px', zIndex: 100 }}>
                  <button onClick={() => { setIsProfileOpen(true); setShowUserMenu(false); }} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #eee', fontWeight: 600, fontSize: '13px' }}>
                    Meu Perfil
                  </button>
                  <button onClick={() => {}} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #eee', fontWeight: 600, fontSize: '13px' }}>
                    Trocar Senha
                  </button>
                  <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#EF4444', fontWeight: 600, fontSize: '13px' }}>
                    Sair (Logout)
                  </button>
                </div>`;
                
  code = code.replace(oldMenu, newMenu);
}

if (!code.includes('<ProfileSettingsModal')) {
  code = code.replace(
    '{/* Footer */}',
    `      <AnimatePresence>
        {isProfileOpen && currentUser && (
          <ProfileSettingsModal 
            currentUser={currentUser} 
            onClose={() => setIsProfileOpen(false)} 
            onUpdate={updateProfile} 
          />
        )}
      </AnimatePresence>
      {/* Footer */}`
  );
}

// ensure AppContent requires updateProfile
if (!code.includes('const { currentUser, logout, updateProfile } = useAuth();')) {
  code = code.replace(
    'const { currentUser, logout } = useAuth();',
    'const { currentUser, logout, updateProfile } = useAuth();'
  );
}


fs.writeFileSync('web/src/App.tsx', code);
console.log('App.tsx updated!');
