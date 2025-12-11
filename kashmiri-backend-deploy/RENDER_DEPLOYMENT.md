# Render.com Backend Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Push Code to GitHub

```bash
cd render-backend
git init
git add .
git commit -m "Backend ready for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kashmir-lodges-backend.git
git push -u origin main
```

### 2. Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub account
3. Allow Render access to your repositories

---

## 📦 Render.com Setup

### Step 1: Create PostgreSQL Database

1. **Dashboard** → **New** → **PostgreSQL**
2. Settings:
   - **Name**: `kashmir-lodges-db`
   - **Database**: `kashmir_lodges`
   - **User**: `kashmir_user`
   - **Region**: Choose closest to your location
   - **PostgreSQL Version**: 15
   - **Plan**: Free (or paid for production)
3. Click **Create Database**
4. **Copy these credentials** (you'll need them):
   - **Internal Database URL** (for backend connection)
   - **External Database URL** (for local testing)

### Step 2: Create Web Service

1. **Dashboard** → **New** → **Web Service**
2. Connect your GitHub repository
3. Settings:
   - **Name**: `kashmir-lodges-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `.` (or leave empty)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for production)

### Step 3: Environment Variables

Add these in **Environment** tab:

```env
NODE_ENV=production
PORT=10000

# Database (use Internal Database URL from PostgreSQL service)
DB_HOST=your-db-hostname.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=kashmir_lodges
DB_USER=kashmir_user
DB_PASSWORD=your-database-password
DATABASE_URL=postgresql://kashmir_user:password@hostname:5432/kashmir_lodges

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# CORS (your frontend domain)
CORS_ORIGIN=https://yourdomain.com

# Email Configuration (Optional - for booking confirmations)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/tmp/uploads
```

**Important:** Replace with your actual values!

### Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically:
   - Install dependencies (`npm install`)
   - Build the project
   - Start the server (`npm start`)
3. Wait 5-10 minutes for first deployment

---

## 🔧 Database Setup

After first deployment, run database migrations:

### Option 1: Using Render Shell

1. Go to your Web Service
2. Click **Shell** tab
3. Run:
```bash
npm run db:create
npm run seed
```

### Option 2: Using Local Connection

```bash
# Install PostgreSQL client locally
npm install -g postgres

# Connect to Render database (use External Database URL)
psql "postgresql://user:password@hostname:5432/dbname"

# Run migrations
\i database/schema.sql
```

---

## 📡 API Endpoints

Your backend will be available at:
```
https://kashmir-lodges-api.onrender.com
```

### Test Endpoints:

```bash
# Health Check
GET https://kashmir-lodges-api.onrender.com/health

# Get Rooms
GET https://kashmir-lodges-api.onrender.com/api/rooms

# Get Offers
GET https://kashmir-lodges-api.onrender.com/api/offers

# Create Booking
POST https://kashmir-lodges-api.onrender.com/api/bookings
```

---

## 🔗 Connect Frontend to Backend

Update your frontend `.env`:

```env
VITE_API_URL=https://kashmir-lodges-api.onrender.com
```

Then rebuild frontend:
```bash
cd ../
npm run build
```

Upload new build to Hostinger.

---

## 📊 Database Schema

Your PostgreSQL database will have these tables:

- `room_types` - 12 room categories with amenities
- `bookings` - Guest booking records
- `offers` - Promotional offers and discounts
- `guest_stays` - Check-in/check-out tracking
- `users` - Admin and staff accounts
- `staff_members` - HR management
- `restaurant_orders` - Restaurant orders
- `coffee_orders` - Coffee shop orders
- `menu_items` - Restaurant menu
- `coffee_menu_items` - Coffee menu
- `expenses` - Financial tracking
- `revenues` - Income tracking

---

## 🎯 Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ⚠️ Service spins down after 15 min inactivity
- ⚠️ Cold start takes 30-60 seconds
- ⚠️ 512 MB RAM

**PostgreSQL Free Tier:**
- ✅ 1 GB storage
- ✅ 97 connection limit
- ⚠️ Expires after 90 days (need to create new one)
- ⚠️ Data is deleted on expiry

**For Production:** Consider paid plans ($7/month for Web Service, $7/month for PostgreSQL)

---

## 🔄 Auto-Deploy Setup

Every time you push to GitHub, Render will automatically deploy:

```bash
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys in 2-3 minutes
```

---

## 🐛 Troubleshooting

### Service Won't Start
- Check logs in Render dashboard
- Verify all environment variables are set
- Check `package.json` has correct start script

### Database Connection Failed
- Use **Internal Database URL** (not External)
- Verify database service is running
- Check firewall/connection settings

### Cold Start Delays
- First request after inactivity takes 30-60 seconds
- Use a service like UptimeRobot to ping every 14 minutes
- Or upgrade to paid plan (no spin down)

### CORS Errors
- Add your Hostinger domain to `CORS_ORIGIN`
- Format: `https://yourdomain.com` (no trailing slash)

---

## 📈 Monitoring

1. **Render Dashboard** → Your Service
2. **Logs** tab - Real-time logs
3. **Metrics** tab - CPU, Memory, Request graphs
4. **Events** tab - Deployment history

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Use environment variables (never commit secrets)
- [ ] Enable CORS only for your domain
- [ ] Use HTTPS only (automatic on Render)
- [ ] Set strong database password
- [ ] Limit file upload sizes
- [ ] Rate limit API endpoints (already configured)

---

## 💰 Cost Estimate

**Free Setup (Testing):**
- Web Service: $0/month (with limitations)
- PostgreSQL: $0/month (90 days)
- **Total: FREE**

**Production Setup:**
- Web Service: $7/month (512 MB RAM, no spin down)
- PostgreSQL: $7/month (1 GB storage, persistent)
- **Total: $14/month (~PKR 3,920/month)**

Compare with:
- Hostinger (Frontend): PKR 199/month
- **Total Monthly: PKR 4,119/month**

---

## 🎉 Deployment Complete!

Once deployed, you'll have:
- ✅ Backend API on Render.com
- ✅ PostgreSQL database with 12 room categories
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ Free tier available for testing

Your hotel management system is now fully deployed! 🏨

---

## 📞 Support

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com
- Support: support@render.com

**Need Help?**
- Check Render logs first
- Review environment variables
- Test database connection
- Verify API endpoints respond
