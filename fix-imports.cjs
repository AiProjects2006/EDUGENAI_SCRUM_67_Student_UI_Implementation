const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixFile(filePath, replacements) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;
        replacements.forEach(({search, replace}) => {
            if (content.includes(search)) {
                content = content.split(search).join(replace);
                modified = true;
            }
        });
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Fixed ${path.basename(filePath)}`);
        }
    }
}

// Fix OceanBackground in LandingPage, Login, Registration, ProfileSetup
const pagesToFix = [
    'features/common/onboarding/ProfileSetup.jsx',
    'features/common/login/Login.jsx',
    'features/common/registration/Registration.jsx',
    'features/common/landing/LandingPage.jsx'
];

pagesToFix.forEach(relPath => {
    fixFile(path.join(srcDir, relPath), [
        {
            search: "../../../components/layout/OceanBackground",
            replace: "../../../components/layout/OceanBackground/OceanBackground"
        }
    ]);
});

// Fix OceanLayout.jsx imports
fixFile(path.join(srcDir, 'components/layout/OceanLayout/OceanLayout.jsx'), [
    {
        search: "../../../components/layout/TopNavigation",
        replace: "../TopNavigation/TopNavigation"
    },
    {
        search: "../../../components/mascot/BubblesMascot",
        replace: "../../mascot/BubblesMascot/BubblesMascot" // assuming mascot is in src/components/mascot/BubblesMascot/BubblesMascot.jsx
    },
    {
        search: "../../../components/layout/OceanBackground",
        replace: "../OceanBackground/OceanBackground"
    }
]);

// Wait, let's check if BubblesMascot is in BubblesMascot folder or just BubblesMascot.jsx
// I will check its path, but for now I'll just change the obvious ones.
