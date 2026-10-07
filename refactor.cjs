const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const fileMoves = [
  // Common
  { name: 'LandingPage', from: 'pages', to: 'features/common/landing' },
  { name: 'Login', from: 'pages', to: 'features/common/login' },
  { name: 'Registration', from: 'pages', to: 'features/common/registration' },
  { name: 'Onboarding', from: 'pages', to: 'features/common/onboarding' },
  { name: 'ProfileSetup', from: 'pages', to: 'features/common/onboarding' },

  // Primary
  { name: 'Dashboard', from: 'pages', to: 'features/primary/dashboard' },
  { name: 'Courses', from: 'pages', to: 'features/primary/courses' },
  { name: 'Notes', from: 'pages', to: 'features/primary/notes' },
  { name: 'ActivityMap', from: 'pages', to: 'features/primary/activity-map' },
  { name: 'ActivityGenerator', from: 'pages', to: 'features/primary/activity-generator' },
  { name: 'ActivityPlayer', from: 'pages', to: 'features/primary/activity-player' },
  { name: 'ScoreFeedback', from: 'pages', to: 'features/primary/score-feedback' },
  { name: 'Recommendations', from: 'pages', to: 'features/primary/recommendations' },
  { name: 'Progress', from: 'pages', to: 'features/primary/progress' },
  { name: 'SavedItems', from: 'pages', to: 'features/primary/saved' },
  { name: 'Profile', from: 'pages', to: 'features/primary/profile' },
  { name: 'Settings', from: 'pages', to: 'features/primary/settings' },

  // Layout
  { name: 'OceanLayout', from: 'layouts', to: 'components/layout/OceanLayout' }
];

const exts = ['.jsx', '.css'];

fileMoves.forEach((move) => {
  const destDir = path.join(srcDir, move.to);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  exts.forEach((ext) => {
    const srcPath = path.join(srcDir, move.from, move.name + ext);
    const destPath = path.join(destDir, move.name + ext);
    if (fs.existsSync(srcPath)) {
      fs.renameSync(srcPath, destPath);
      console.log(`Moved ${move.name}${ext} to ${move.to}`);
      
      if (ext === '.jsx') {
        let content = fs.readFileSync(destPath, 'utf-8');
        
        const destDepth = move.to.split('/').length;
        const relativePrefix = '../'.repeat(destDepth);
        
        content = content.replace(/\.\.\/components\//g, `${relativePrefix}components/`);
        content = content.replace(/\.\.\/context\//g, `${relativePrefix}context/`);
        content = content.replace(/\.\.\/services\//g, `${relativePrefix}services/`);
        content = content.replace(/\.\.\/assets\//g, `${relativePrefix}assets/`);
        content = content.replace(/\.\.\/utils\//g, `${relativePrefix}utils/`);
        content = content.replace(/\.\.\/hooks\//g, `${relativePrefix}hooks/`);
        
        fs.writeFileSync(destPath, content, 'utf-8');
      }
    }
  });
});

const appPath = path.join(srcDir, 'App.jsx');
if (fs.existsSync(appPath)) {
  let appContent = fs.readFileSync(appPath, 'utf-8');
  fileMoves.forEach((move) => {
    if (move.from === 'pages') {
      const regex = new RegExp(`'\\./pages/${move.name}'`, 'g');
      appContent = appContent.replace(regex, `'./${move.to}/${move.name}'`);
    } else if (move.from === 'layouts') {
      const regex = new RegExp(`'\\./layouts/${move.name}'`, 'g');
      appContent = appContent.replace(regex, `'./${move.to}/${move.name}'`);
    }
  });
  fs.writeFileSync(appPath, appContent, 'utf-8');
  console.log('Updated App.jsx imports');
}

['pages', 'layouts'].forEach((oldDir) => {
  const dirPath = path.join(srcDir, oldDir);
  if (fs.existsSync(dirPath)) {
    try {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Removed empty directory: ${oldDir}`);
    } catch (e) {
        console.error(`Failed to remove ${oldDir}: ${e.message}`);
    }
  }
});

console.log('Refactoring complete.');
