const fs = require('fs');
const execSync = require('child_process').execSync;


fetch('https://www.random.org/strings/?num=1&len=20&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain')
    .then(response => response.text())
    .then(PASS => {
        const args = process.argv.slice(2);
        const data = {
            "POSTGRES_PASSWORD": PASS.trim().replace(/\n/g, '').replace(/\r/g, ''),
            "POSTGRES_USER": "snailycadbot",
            "BOT_TOKEN": args[0],
        };

        execSync(`cd /mnt/server`, { stdio: 'inherit' });

        execSync(`echo "Cloning"`, { stdio: 'inherit' });
        execSync(`git clone https://github.com/SnailyCAD/snailycad-bot.git`, { stdio: 'inherit' });
        execSync(`cp -rf snailycad-bot/. .`, { stdio: 'inherit' });
        execSync(`rm -rf snailycad-bot`, { stdio: 'inherit' });
        execSync(`cp .env.example .env`, { stdio: 'inherit' });
        execSync(`echo "Changing ENV"`, { stdio: 'inherit' });

        try {
            let envdir = './.env';
            let fileContent = fs.readFileSync(envdir, 'utf-8');
            let fileLines = fileContent.split('\n');
            Object.keys(data).forEach(element => {
                let lineIndex = fileLines.findIndex(line => line.startsWith(element + '='));
                if (/^\d+$/.test(data[element])) {
                    fileLines[lineIndex] = element + '=' + (data[element] ? data[element] : '');
                } else {
                    fileLines[lineIndex] = element + '=\"' + data[element] + '\"';
                }
                fs.writeFileSync(envdir, fileLines.join('\n'));
            });
        } catch (error) {
            console.error('Error:', error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
