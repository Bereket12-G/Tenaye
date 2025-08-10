# 🚀 Deployment Guide

This guide will help you deploy your Challenge Portal React app to both Vercel and GitHub Pages.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- GitHub account
- Vercel account (optional, for Vercel deployment)

## 🌐 **Deployment to Vercel**

### **Option 1: Deploy via Vercel Dashboard (Recommended)**

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:
   ```
   VITE_APP_TITLE=Challenge Portal
   VITE_APP_DESCRIPTION=Wellness challenges and progress tracking
   VITE_APP_VERSION=1.0.0
   VITE_ENABLE_PWA=true
   VITE_ENABLE_ANALYTICS=false
   VITE_ENABLE_DEBUG_MODE=false
   VITE_ENABLE_SERVICE_WORKER=false
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app automatically
   - Your app will be available at `https://your-project-name.vercel.app`

### **Option 2: Deploy via Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Set project name
   - Confirm deployment

## 📚 **Deployment to GitHub Pages**

### **Step 1: Update Repository Settings**

1. **Update package.json homepage**
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
   }
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values.

2. **Enable GitHub Pages**
   - Go to your GitHub repository
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"

### **Step 2: Push Code to GitHub**

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### **Step 3: Monitor Deployment**

1. **Check GitHub Actions**
   - Go to your repository on GitHub
   - Click "Actions" tab
   - You should see the deployment workflow running

2. **Access Your Site**
   - Once deployment is complete, your site will be available at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## 🔧 **Configuration Files**

### **Vercel Configuration (`vercel.json`)**
- Handles SPA routing with rewrites
- Sets security headers
- Configures build settings
- Defines environment variables

### **GitHub Actions (`/.github/workflows/deploy.yml`)**
- Automatically builds on push to main branch
- Deploys to GitHub Pages
- Includes proper caching and permissions

## 🌍 **Environment Variables**

Both deployment methods use these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_TITLE` | App title | Challenge Portal |
| `VITE_APP_DESCRIPTION` | App description | Wellness challenges... |
| `VITE_APP_VERSION` | App version | 1.0.0 |
| `VITE_ENABLE_PWA` | Enable PWA features | true |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | false |
| `VITE_ENABLE_DEBUG_MODE` | Enable debug mode | false |
| `VITE_ENABLE_SERVICE_WORKER` | Enable service worker | false |

## 🔄 **Continuous Deployment**

### **Vercel**
- Automatically deploys on every push to main branch
- Provides preview deployments for pull requests
- Includes automatic rollbacks

### **GitHub Pages**
- Deploys on push to main/master branch
- Uses GitHub Actions for build process
- Includes build status checks

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   ```bash
   # Test build locally
   npm run build
   ```

2. **Routing Issues (404 on refresh)**
   - Vercel: Handled by `vercel.json` rewrites
   - GitHub Pages: Handled by `404.html` fallback

3. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Check deployment platform settings

4. **Assets Not Loading**
   - Verify `homepage` in package.json
   - Check base path in vite.config.ts

### **Debug Commands**

```bash
# Test build
npm run build

# Test locally
npm run preview

# Check for linting issues
npm run lint

# Verify TypeScript
npx tsc --noEmit
```

## 📱 **PWA Features**

Your app includes PWA features:
- Web App Manifest
- Responsive design
- Offline capabilities (when service worker enabled)
- Install prompt

## 🔒 **Security**

Both deployments include:
- Content Security Policy headers
- XSS protection
- Frame options
- Content type options

## 📊 **Performance**

- Optimized builds with Vite
- Code splitting
- Asset optimization
- Gzip compression

## 🎯 **Next Steps**

After deployment:

1. **Test all features** on the live site
2. **Set up custom domain** (optional)
3. **Configure analytics** (if needed)
4. **Set up monitoring** for performance
5. **Create deployment documentation** for your team

## 📞 **Support**

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Pages**: [pages.github.com](https://pages.github.com)
- **Vite**: [vitejs.dev/guide/deploy](https://vitejs.dev/guide/deploy)

---

**Happy Deploying! 🚀**