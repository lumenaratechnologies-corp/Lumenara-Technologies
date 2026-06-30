# Email Setup Instructions

## Quick Setup with EmailJS (Recommended)

The contact form is currently using FormSubmit as a fallback, but for a more reliable solution, set up EmailJS:

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service
1. Go to "Email Services" in the dashboard
2. Click "Add New Service"
3. Choose "Gmail" (recommended)
4. Connect your Gmail account (lumenaratechnologies@gmail.com)
5. Copy your **Service ID**

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Set the template as follows:
   - **To Email**: `lumenaratechnologies@gmail.com`
   - **From Name**: `{{from_name}}`
   - **Reply To**: `{{reply_to}}`
   - **Subject**: `New Contact Form Submission from {{from_name}}`
   - **Content**:
     ```
     From: {{from_name}} ({{from_email}})
     
     Message:
     {{message}}
     
     ---
     This email was sent from the Lumenara contact form.
     ```
4. Copy your **Template ID**

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

### Step 5: Configure Environment Variables
Create a `.env` file in the project root:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Step 6: Restart Development Server
```bash
npm run dev
```

## Alternative: Using FormSubmit (Current Setup)

The form currently uses FormSubmit which requires no setup, but:
- First email will require verification (check spam folder)
- After verification, all emails will be delivered automatically
- No configuration needed - it just works!

## Testing

1. Fill out the contact form
2. Submit the form
3. Check `lumenaratechnologies@gmail.com` for the email
4. If using FormSubmit for the first time, click the verification link

