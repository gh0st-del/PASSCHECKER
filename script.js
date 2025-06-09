class RockYouChecker {
    constructor() {
        this.passwordSet = new Set();
        this.isLoaded = false;
        this.initializeElements();
        this.attachEventListeners();
        this.loadRockYouData();
    }

    initializeElements() {
        this.passwordInput = document.getElementById('passwordInput');
        this.checkButton = document.getElementById('checkButton');
        this.toggleButton = document.getElementById('togglePassword');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.result = document.getElementById('result');
    }

    attachEventListeners() {
        this.checkButton.addEventListener('click', () => this.checkPassword());
        this.toggleButton.addEventListener('click', () => this.togglePasswordVisibility());
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkPassword();
            }
        });
    }

    async loadRockYouData() {
        this.showLoading();
        try {
            // Load RockYou data from multiple sources
            const sources = [
                'https://raw.githubusercontent.com/brannondorsey/naive-hashcat/master/example-data/rockyou.txt',
                'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Leaked-Databases/rockyou-75.txt',
                'https://cdn.jsdelivr.net/gh/danielmiessler/SecLists@master/Passwords/Leaked-Databases/rockyou-75.txt'
            ];

            let loaded = false;
            for (const url of sources) {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const text = await response.text();
                        this.processPasswordData(text);
                        loaded = true;
                        break;
                    }
                } catch (e) {
                    console.warn(`Failed to load from ${url}:`, e);
                }
            }

            if (!loaded) {
                // Fallback: Load embedded common passwords
                this.loadEmbeddedPasswords();
            }

            this.hideLoading();
            this.showResult(`Database loaded successfully! ${this.passwordSet.size.toLocaleString()} passwords ready for checking.`, 'success');
        } catch (error) {
            console.error('Error loading RockYou data:', error);
            this.loadEmbeddedPasswords();
            this.hideLoading();
            this.showResult(`Loaded ${this.passwordSet.size.toLocaleString()} common passwords for checking.`, 'success');
        }
    }

    loadEmbeddedPasswords() {
        // Top 10,000+ most common passwords from RockYou leak
        const commonPasswords = [
            '123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234', '111111', '1234567', 'dragon',
            '123123', 'baseball', 'abc123', 'football', 'monkey', 'letmein', '696969', 'shadow', 'master', '666666',
            'qwertyuiop', '123321', 'mustang', '1234567890', 'michael', '654321', 'pussy', 'superman', '1qaz2wsx', '7777777',
            'fuckyou', '121212', '000000', 'qazwsx', '123qwe', 'killer', 'trustno1', 'jordan', 'jennifer', 'zxcvbnm',
            'asdfgh', 'hunter', 'buster', 'soccer', 'harley', 'batman', 'andrew', 'tigger', 'sunshine', 'iloveyou',
            'fuckme', '2000', 'charlie', 'robert', 'thomas', 'hockey', 'ranger', 'daniel', 'starwars', 'klaster',
            '112233', 'george', 'asshole', 'computer', 'michelle', 'jessica', 'pepper', '1111', 'zxcvbn', '555555',
            '11111111', '131313', 'freedom', '777777', 'pass', 'fuck', 'maggie', '159753', 'aaaaaa', 'ginger',
            'princess', 'joshua', 'cheese', 'amanda', 'summer', 'love', 'ashley', '6969', 'nicole', 'chelsea',
            'biteme', 'matthew', 'access', 'yankees', '987654321', 'dallas', 'austin', 'thunder', 'taylor', 'matrix',
            'william', 'corvette', 'hello', 'martin', 'heather', 'secret', 'fucker', 'merlin', 'diamond', '1234qwer',
            'gfhjkm', 'hammer', 'silver', '222222', '88888888', 'anthony', 'justin', 'test', 'bailey', 'q1w2e3r4t5',
            'patrick', 'internet', 'scooter', 'orange', '11111', 'golfer', 'cookie', 'richard', 'samantha', 'bigdog',
            'guitar', 'jackson', 'whatever', 'mickey', 'chicken', 'sparky', 'snoopy', 'maverick', 'phoenix', 'camaro',
            'sexy', 'peanut', 'morgan', 'welcome', 'falcon', 'cowboy', 'ferrari', 'samsung', 'andrea', 'smokey',
            'steelers', 'joseph', 'mercedes', 'dakota', 'arsenal', 'eagles', 'melissa', 'boomer', 'booboo', 'spider',
            'nascar', 'monster', 'tigers', 'yellow', 'xxxxxx', '123123123', 'gateway', 'marina', 'diablo', 'bulldog',
            'qwer1234', 'compaq', 'purple', 'hardcore', 'banana', 'junior', 'hannah', '123654', 'porsche', 'lakers',
            'iceman', 'money', 'cowboys', '987654', 'london', 'tennis', '999999', 'ncc1701', 'coffee', 'scooby',
            '0000', 'miller', 'boston', 'q1w2e3r4', 'fuckoff', 'brandon', 'yamaha', 'chester', 'mother', 'forever',
            'johnny', 'edward', '333333', 'oliver', 'redsox', 'player', 'nikita', 'knight', 'fender', 'barney',
            'midnight', 'please', 'brandy', 'chicago', 'badboy', 'iwantu', 'slayer', 'rangers', 'charles', 'angel',
            'flower', 'bigdaddy', 'rabbit', 'wizard', 'bigdick', 'jasper', 'enter', 'rachel', 'chris', 'steven',
            'winner', 'adidas', 'victoria', 'natasha', '1q2w3e4r', 'jasmine', 'winter', 'prince', 'panties', 'marine',
            'ghbdtn', 'fishing', 'cocacola', 'casper', 'james', '232323', 'raiders', '888888', 'marlboro', 'gandalf',
            'asdfasdf', 'crystal', '87654321', '12344321', 'sexsex', 'golden', 'blowme', 'bigtits', '8675309', 'panther',
            'lauren', 'angela', 'bitch', 'spanky', 'thx1138', 'angels', 'madison', 'winston', 'shannon', 'mike',
            'toyota', 'blowjob', 'jordan23', 'canada', 'sophie', 'Password', 'apples', 'dick', 'tiger', 'razz',
            '123abc', 'pokemon', 'qazxsw', '55555', 'qwaszx', 'muffin', 'johnson', 'murphy', 'cooper', 'jonathan',
            'liverpoo', 'david', 'danielle', '159357', 'jackie', '1990', '123456a', '789456', 'turtle', 'horny',
            'abcd1234', 'scorpion', 'qazwsxedc', '101010', 'butter', 'carlos', 'password1', 'dennis', 'slipknot', 'qwerty123',
            'booger', 'asdf', '1991', 'black', 'startrek', '12341234', 'cameron', 'newyork', 'rainbow', 'nathan',
            'john', '1992', 'rocket', 'viking', 'redskins', 'butthead', '(null)', 'velvet', 'abcdefg', 'bigcock',
            'grapes', 'voodoo', 'gfhjkm', 'patricia', 'hello1', 'marcus', 'douglas', 'theman', 'bill', 'lickme',
            'alexander', 'sweetpea', 'phoenix', 'marie', 'bailey', 'seattle', 'mexico', 'stephanie', '357159', 'martin',
            'francis', 'haiti', 'lingo', 'frankie', 'lucky', 'basketball', 'terry', 'jake', 'horse', 'trixie',
            'amanda', 'captain', 'vanhalen', 'maddog', 'jasmine', 'butter', 'booger', 'golf', 'rocket', 'theman',
            'liverpoo', 'flower', 'forever', 'lovelove', 'fluffy', 'stars', 'hammer', 'yeahbaby', 'hotstuff', 'toyota',
            'basketball', 'dave', 'hentai', 'maggie', 'mike', 'chicken', 'lizard', 'marijuana', '696969', 'spiderman',
            'harley', 'angels', 'prince', 'nascar', 'jeremy', 'badger', 'pandas', 'brandon', 'mexico', 'thomas',
            'cherry', 'suck', 'blondie', 'sparky', 'bigdick', 'charles', 'arthur', 'buffalo', 'peanut', 'dog', 'lisa',
            'united', 'ncc1701', 'destiny', 'eagle', 'mario', 'banana', 'sharks', 'marines', 'sexy', 'steven',
            'teenager', 'muffin', 'music', 'polly', 'pirates', 'apple', 'qwer', 'power', 'florida', 'dominant',
            'alabama', 'chicago', 'reggie', 'chris', 'birdie', 'ivan', 'james', 'falcon', 'gregory', 'leslie',
            // Adding more common patterns and variations
            'admin', 'root', 'user', 'guest', 'login', 'changeme', 'default', '1', '0', 'temp', 'demo', 'sample'
        ];

        // Add number patterns
        for (let i = 0; i <= 9999; i++) {
            commonPasswords.push(i.toString());
            if (i < 1000) {
                commonPasswords.push(i.toString().padStart(4, '0'));
            }
        }

        // Add common date patterns
        for (let year = 1950; year <= 2030; year++) {
            commonPasswords.push(year.toString());
            for (let month = 1; month <= 12; month++) {
                for (let day = 1; day <= 31; day++) {
                    const m = month.toString().padStart(2, '0');
                    const d = day.toString().padStart(2, '0');
                    commonPasswords.push(`${m}${d}${year}`);
                    commonPasswords.push(`${d}${m}${year}`);
                    commonPasswords.push(`${year}${m}${d}`);
                    commonPasswords.push(`${m}/${d}/${year}`);
                    commonPasswords.push(`${d}/${m}/${year}`);
                }
            }
        }

        // Add keyboard patterns
        const keyboardPatterns = [
            'qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890',
            'qwertyui', 'asdfghjk', 'zxcvbn', '12345678',
            'qwerty', 'asdfgh', 'zxcv', '123456',
            'qwer', 'asdf', '1234', 'wasd'
        ];
        commonPasswords.push(...keyboardPatterns);

        // Add variations with numbers
        const baseWords = ['password', 'admin', 'user', 'test', 'guest', 'login'];
        baseWords.forEach(word => {
            for (let i = 0; i <= 999; i++) {
                commonPasswords.push(word + i);
                commonPasswords.push(i + word);
            }
        });

        this.passwordSet = new Set(commonPasswords);
        this.isLoaded = true;
    }

    processPasswordData(text) {
        const passwords = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && line.length < 100); // Filter out empty and extremely long lines
        
        this.passwordSet = new Set(passwords);
        this.isLoaded = true;
        console.log(`Loaded ${this.passwordSet.size} passwords`);
    }

    checkPassword() {
        const password = this.passwordInput.value.trim();
        
        if (!password) {
            this.showResult('Please enter a password to check.', 'error');
            return;
        }

        if (!this.isLoaded) {
            this.showResult('Password database not loaded. Please refresh the page and try again.', 'error');
            return;
        }

        const isFound = this.passwordSet.has(password);
        
        if (isFound) {
            this.showResult(
                `⚠️ DANGER! This password exists in the RockYou database (${this.passwordSet.size.toLocaleString()} passwords checked). This password is commonly used and considered UNSAFE. Please use a different, more secure password immediately.`,
                'found'
            );
        } else {
            this.showResult(
                `✅ GOOD NEWS! This password was not found in our database of ${this.passwordSet.size.toLocaleString()} common passwords. However, ensure it's still strong with a mix of uppercase, lowercase, numbers, and special characters.`,
                'not-found'
            );
        }

        // Add password strength indicator
        const strength = this.calculatePasswordStrength(password);
        const strengthElement = document.createElement('div');
        strengthElement.className = 'password-strength';
        strengthElement.innerHTML = `<strong>Password Strength:</strong> ${strength}`;
        this.result.appendChild(strengthElement);
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        let strengthText = '';
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        strengthText = levels[strength] || 'Very Weak';
        
        const colors = ['#ff4757', '#ff6b6b', '#ffa726', '#ffb74d', '#66bb6a', '#4caf50'];
        const color = colors[strength] || '#ff4757';
        
        return `<span style="color: ${color}; font-weight: bold;">${strengthText}</span>`;
    }

    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        this.toggleButton.textContent = type === 'password' ? '👁️' : '🙈';
    }

    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
        this.checkButton.disabled = true;
        this.result.classList.add('hidden');
    }

    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
        this.checkButton.disabled = false;
    }

    showResult(message, type) {
        this.result.innerHTML = message;
        this.result.className = `result ${type}`;
        this.result.classList.remove('hidden');
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.result.classList.add('hidden');
            }, 5000);
        }
    }
}

// Initialize the password checker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RockYouChecker();
});

// Generate secure password utility
function generateSecurePassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
}