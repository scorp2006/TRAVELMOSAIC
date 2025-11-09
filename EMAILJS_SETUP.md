# EmailJS Setup Guide (5 Minutes) 📧

EmailJS allows you to send emails directly from your browser - completely FREE (200 emails/month).

## Step 1: Create EmailJS Account (2 min)

1. Go to **https://www.emailjs.com/**
2. Click **"Sign Up"** (top right)
3. Sign up with Google or email (it's FREE - no credit card needed!)
4. Verify your email

## Step 2: Add Email Service (1 min)

1. In your EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **Gmail** (easiest option)
4. Click **"Connect Account"** and sign in with your Gmail
5. Click **"Create Service"**
6. **Copy your Service ID** (looks like: `service_abc123`)

## Step 3: Create Email Template (1 min)

1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. **Template Name**: `Trip Invitation`
4. **Replace the email content** with this:

```
Subject: {{from_name}} invited you to join {{trip_name}}!

Hi {{to_name}},

You've been invited to collaborate on a trip: {{trip_name}}

{{message}}

Click the link below to join:
{{trip_link}}

Happy travels!
TripMosaic
```

5. Click **"Save"**
6. **Copy your Template ID** (looks like: `template_xyz789`)

## Step 4: Get Your Public Key (30 sec)

1. Go to **"Account"** → **"General"**
2. Under **"Public Key"**, click **"Copy"**
3. **Copy your Public Key** (looks like: `abcdefgh1234567`)

## Step 5: Add Keys to Your App (30 sec)

Open `D:\saradha\TRIPMOSAIC\src\services\emailService.ts` and replace:

```typescript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Paste Service ID here
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Paste Template ID here
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Paste Public Key here
```

## ✅ Done! Test It Out

1. Go to your app
2. Click "Invite Member" on any trip
3. Enter an email and click "Send Invite"
4. Check the inbox - you should receive a beautiful invitation email! 📨

## Email Template Variables

The email uses these variables (already configured):
- `{{to_name}}` - Recipient's name (from email address)
- `{{from_name}}` - Your name
- `{{trip_name}}` - Trip name
- `{{trip_link}}` - Direct link to trip
- `{{message}}` - Custom message about the trip

## Troubleshooting

**Emails not sending?**
- Make sure all 3 keys are copied correctly
- Check EmailJS dashboard for error logs
- Verify Gmail service is connected

**Need more emails?**
- Free tier: 200 emails/month
- Personal plan: $7/month for 1,000 emails
- Upgrade anytime at dashboard.emailjs.com

## Example Email Your Friends Will Receive

```
Subject: John invited you to join Summer Europe Trip!

Hi Sarah,

You've been invited to collaborate on a trip: Summer Europe Trip

Join us for our trip to Paris, France!

Click the link below to join:
https://yourapp.com/trip/abc123

Happy travels!
TripMosaic
```

---

**Questions?** Check https://www.emailjs.com/docs/
