# 🚀 MD Converter Pro

**Transform your Markdown files into beautiful, interactive websites with a single click!**

Built with ❤️ by [Sagar Kumar](https://www.linkedin.com/in/sagar-kumar-iit-kgp/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sagar54368/md_convertor)

## ✨ Features

### 📝 Smart Markdown Processing
- **Multi-file upload** - Upload single or multiple .md files
- **Real-time rendering** - See your markdown come to life instantly
- **Table of Contents** - Auto-generated navigation from headings

### 🎨 Interactive Components
- **Syntax highlighting** - Beautiful code blocks with copy button
- **Mermaid diagrams** - Flowcharts, sequence diagrams, and more
- **Math equations** - LaTeX support with KaTeX
- **Tables** - Clean, responsive table rendering
- **Images & Links** - Full support with proper formatting

### 📤 Export Options
- **HTML** - Clean, standalone HTML files
- **PDF** - Professional PDF documents
- **DOC** - Microsoft Word compatible files
- **Preserves formatting** - Tables and code blocks in all formats

### 🎯 User Experience
- **Dark theme** - Easy on the eyes
- **Responsive design** - Works on all devices
- **Error reporting** - Built-in error reporting system
- **Smooth animations** - Polished user interface

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Markdown** - Markdown rendering
- **Mermaid** - Diagram generation
- **jsPDF** - PDF export
- **Framer Motion** - Animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/sagar54368/md_convertor.git
cd md_convertor

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3456](http://localhost:3456) in your browser.

## 📦 Deployment to Vercel

### Method 1: One-Click Deploy

Click the "Deploy with Vercel" button above and follow the prompts.

### Method 2: Manual Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/sagar54368/md_convertor.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: **Next.js**
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Environment Variables (Optional)

If you want to add Google Forms integration for error reporting:

```env
NEXT_PUBLIC_GOOGLE_FORM_URL=your_google_form_url
```

## 📖 Usage

1. **Upload Files**
   - Click the upload area or drag and drop .md files
   - Multiple files will be combined into one document

2. **Preview**
   - Your markdown renders in real-time
   - Navigate using the sidebar TOC
   - Code blocks have copy buttons

3. **Export**
   - Choose HTML, PDF, or DOC format
   - Download starts automatically
   - All formatting is preserved

## 🎨 Customization

### Change Theme Colors

Edit `app/globals.css`:

```css
:root {
  --background: #0a0a0a;
  --accent-blue: #60a5fa;
  --accent-green: #34d399;
  --accent-purple: #a78bfa;
}
```

### Add Custom Markdown Extensions

Edit `components/MarkdownRenderer.tsx` to add custom remark/rehype plugins.

## 🐛 Error Reporting

Users can report errors directly from the app. Errors are logged with:
- Error message and stack trace
- User description (optional)
- User email for follow-up (optional)
- Timestamp and browser info

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project however you like!

## 🙋‍♂️ Support

Created by **Sagar Kumar** (IIT Kharagpur)

- LinkedIn: [linkedin.com/in/sagar-kumar-iit-kgp](https://www.linkedin.com/in/sagar-kumar-iit-kgp/)
- GitHub: [@sagar54368](https://github.com/sagar54368)

## 🌟 Contributing

Love this project? Here's how you can help:

1. **Star this repository** ⭐ - It really helps!
2. **Share with others** - Spread the word
3. **Report bugs** - Open an issue if you find something
4. **Suggest features** - We're always improving
5. **Submit PRs** - Contributions are welcome!

All contributions, big or small, are appreciated and will be acknowledged.

If you find this useful, please ⭐ star the repository!

---

**Made with ❤️ by Sagar Kumar**
