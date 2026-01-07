# TLS/SSL Security Configuration Guide for Hostinger

## ❌ Errors from web-check.xyz

You received these errors:
- `tls-cipher-suites` - Weak or outdated encryption algorithms
- `tls-security-config` - TLS configuration security issues
- `tls-client-support` - TLS protocol version support problems

## 🎯 Important: These Are **SERVER-SIDE** Issues

**These CANNOT be fixed in your frontend code (React/Vite).** They must be configured on your hosting server (Hostinger).

---

## ✅ What I've Already Fixed in .htaccess

I've added these security headers to your `.htaccess`:

```apache
✓ Content-Security-Policy (CSP)
✓ Strict-Transport-Security (HSTS)
✓ HTTPS redirect (HTTP → HTTPS)
✓ Permissions-Policy
✓ Enhanced security headers
```

**However**, TLS cipher suites and protocol versions are controlled at the **Apache/server level**, not via `.htaccess`.

---

## 🔧 How to Fix TLS Issues on Hostinger

### Step 1: Access Hostinger Control Panel

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com/)
2. Go to your website's hosting panel
3. Navigate to **Advanced** section

### Step 2: Check SSL/TLS Certificate

#### Verify SSL Certificate is Active:
1. Go to **SSL** section in hPanel
2. Ensure you have a **valid SSL certificate** installed
3. Hostinger provides **free SSL certificates** (Let's Encrypt)

#### If No SSL Certificate:
```
1. Click "SSL" in hPanel
2. Select "Install SSL Certificate"
3. Choose "Free SSL Certificate" (Let's Encrypt)
4. Click "Install"
5. Wait 5-10 minutes for activation
```

### Step 3: Force HTTPS (Already Done in .htaccess)

The updated `.htaccess` now forces all HTTP traffic to HTTPS:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Step 4: Configure TLS Settings (Hostinger Support Required)

**TLS cipher suites and protocol versions are server-level settings.**

#### Option A: Contact Hostinger Support (Recommended)

Submit a support ticket requesting:

```
Subject: Enable Modern TLS Configuration for Enhanced Security

Hello Hostinger Support,

I'm running web security checks on my site (devdaniel.tech) and 
discovered that the TLS configuration needs updating to modern standards.

Could you please:

1. Enable TLS 1.2 and TLS 1.3 protocols ONLY (disable TLS 1.0 and 1.1)
2. Configure modern cipher suites (disable weak/deprecated ciphers)
3. Enable Forward Secrecy (ECDHE cipher suites)
4. Ensure HSTS is properly configured

Security scan errors:
- tls-cipher-suites
- tls-security-config  
- tls-client-support

Thank you!
```

#### Option B: Check Current TLS Configuration

Test your current TLS setup:

**SSL Labs Test:**
```
https://www.ssllabs.com/ssltest/analyze.html?d=devdaniel.tech
```

This will show:
- TLS protocol versions enabled
- Cipher suites supported
- Certificate details
- Security grade (A+, A, B, C, F)

**Target Grade:** A or A+

---

## 📋 Modern TLS Configuration (What Hostinger Should Enable)

### TLS Protocol Versions
```
✓ TLS 1.3 (Newest, most secure)
✓ TLS 1.2 (Widely supported, secure)
❌ TLS 1.1 (Deprecated, disable)
❌ TLS 1.0 (Deprecated, disable)
❌ SSL 3.0 (Insecure, disable)
❌ SSL 2.0 (Insecure, disable)
```

### Recommended Cipher Suites (Strong Encryption)
```
TLS 1.3:
✓ TLS_AES_256_GCM_SHA384
✓ TLS_AES_128_GCM_SHA256
✓ TLS_CHACHA20_POLY1305_SHA256

TLS 1.2:
✓ ECDHE-RSA-AES256-GCM-SHA384
✓ ECDHE-RSA-AES128-GCM-SHA256
✓ ECDHE-RSA-CHACHA20-POLY1305
✓ DHE-RSA-AES256-GCM-SHA384
```

### Disable Weak Ciphers
```
❌ RC4 (insecure)
❌ DES/3DES (weak)
❌ MD5 (broken)
❌ Export ciphers (very weak)
❌ Anonymous ciphers (no authentication)
❌ NULL ciphers (no encryption)
```

---

## 🔍 Verify Your Current Setup

### Test Your SSL/TLS Configuration:

#### 1. **SSL Labs (Most Comprehensive)**
```bash
https://www.ssllabs.com/ssltest/analyze.html?d=devdaniel.tech
```
- Shows cipher suites, protocols, vulnerabilities
- Provides detailed security grade
- Industry standard tool

#### 2. **web-check.xyz** (What you used)
```bash
https://web-check.xyz/
```
- General website security check
- Includes TLS analysis

#### 3. **Security Headers**
```bash
https://securityheaders.com/?q=devdaniel.tech
```
- Checks HTTP security headers
- Should improve after .htaccess update

#### 4. **Mozilla Observatory**
```bash
https://observatory.mozilla.org/analyze/devdaniel.tech
```
- Comprehensive security scan
- Provides actionable recommendations

#### 5. **Hardenize**
```bash
https://www.hardenize.com/
```
- TLS configuration checker
- Certificate chain analysis

---

## 🛡️ What The Updated .htaccess Does

### Security Headers Added:

```apache
1. Content-Security-Policy (CSP)
   - Prevents XSS attacks
   - Controls resource loading sources
   - Allows only trusted CDNs

2. Strict-Transport-Security (HSTS)
   - Forces HTTPS for 1 year
   - Includes all subdomains
   - Enables HSTS preload list

3. HTTPS Redirect
   - Automatically redirects HTTP → HTTPS
   - 301 permanent redirect
   - SEO-friendly

4. Permissions-Policy
   - Disables unnecessary browser features
   - Prevents privacy leaks
   - Blocks geolocation, camera, mic access
```

---

## 📊 Expected Results After Fixes

### Before (Current State):
```
❌ TLS 1.0/1.1 enabled
❌ Weak cipher suites
❌ No HSTS
❌ Mixed HTTP/HTTPS
```

### After (Target State):
```
✓ TLS 1.2 and 1.3 only
✓ Strong cipher suites (ECDHE, AES-GCM)
✓ HSTS enabled
✓ All HTTPS with automatic redirect
✓ SSL Labs grade: A or A+
✓ All web-check.xyz TLS tests passing
```

---

## 🚀 Additional Hostinger Settings to Check

### 1. **PHP Version**
- Use PHP 8.1+ for best security
- Location: hPanel → Advanced → PHP Configuration

### 2. **ModSecurity**
- Enable if available
- Provides web application firewall (WAF)
- Location: hPanel → Advanced → ModSecurity

### 3. **HTTP/2**
- Ensure HTTP/2 is enabled (faster + more secure)
- Usually enabled by default with SSL
- Check in: hPanel → Advanced

### 4. **IPv6**
- Enable IPv6 if your site supports it
- Better for modern networks
- Location: hPanel → DNS/IP Settings

---

## 📝 Summary & Action Items

### ✅ Already Fixed (Frontend):
1. Enhanced `.htaccess` with security headers
2. HTTPS redirect configured
3. HSTS header set
4. CSP and security policies added

### 🔧 Requires Hostinger Action (Backend):
1. **Contact Hostinger Support** to:
   - Disable TLS 1.0 and TLS 1.1
   - Enable only modern cipher suites
   - Verify TLS 1.2 and 1.3 are enabled
   - Remove weak/deprecated ciphers

2. **Verify SSL Certificate**:
   - Ensure valid SSL cert is installed
   - Check expiration date
   - Auto-renewal should be enabled

3. **Test After Changes**:
   - Run SSL Labs test: https://www.ssllabs.com/ssltest/
   - Rerun web-check.xyz
   - Verify grade is A or A+

---

## ⚡ Quick Fix Checklist

```bash
☐ 1. Verify SSL certificate is installed (hPanel → SSL)
☐ 2. Upload updated .htaccess file to server
☐ 3. Test HTTPS redirect works (http:// → https://)
☐ 4. Contact Hostinger support for TLS configuration
☐ 5. Wait for support to update server TLS settings
☐ 6. Test with SSL Labs: https://www.ssllabs.com/ssltest/
☐ 7. Verify web-check.xyz errors are resolved
☐ 8. Check Security Headers: https://securityheaders.com/
```

---

## 🔗 Useful Resources

- **SSL Labs Test**: https://www.ssllabs.com/ssltest/
- **Hostinger SSL Guide**: https://support.hostinger.com/en/articles/1583322-how-to-install-an-ssl-certificate
- **Mozilla SSL Config Generator**: https://ssl-config.mozilla.org/
- **HSTS Preload List**: https://hstspreload.org/

---

## 💡 Why This Matters

### Security Benefits:
- Protects user data in transit (encryption)
- Prevents man-in-the-middle attacks
- Builds trust with visitors
- Required for modern web standards

### SEO Benefits:
- Google favors HTTPS sites
- Better search rankings
- Chrome shows "Secure" badge
- Required for PWA features

### Compliance:
- GDPR requires encryption for personal data
- PCI-DSS requires TLS 1.2+ for payment data
- Industry best practices

---

## ❓ Hostinger Support Contact

If you need help from Hostinger:

**Support Portal**: https://www.hostinger.com/contact  
**Live Chat**: Available 24/7 in hPanel  
**Email**: support@hostinger.com  
**Phone**: Check your Hostinger dashboard for regional number

**Response Time**: Usually 1-2 hours for live chat, 24 hours for tickets

---

## 📌 Final Note

**The .htaccess updates will improve your security headers score** (check with securityheaders.com), but the **TLS cipher suite and protocol errors require Hostinger's server configuration changes**.

After Hostinger updates the TLS settings, your web-check.xyz scan should show all green checkmarks! 🎉
