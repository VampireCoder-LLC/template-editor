# Template Editor Demo Application

This is a demo React application that tests the `@vampirecoder/template-editor` NPM package installation and functionality.

## 📋 Overview

The demo application demonstrates:
- ✅ Installing the template-editor package from a local file path
- ✅ Importing and using the `TemplateEditor` component
- ✅ Passing props to control component behavior
- ✅ Handling the `onSave` callback
- ✅ Working with TypeScript types from the package
- ✅ Feature toggles (e.g., `showJsonTab`)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- The main template-editor project built (run `npm run build` in the parent directory)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - React and React DOM
   - Vite and build tools
   - TypeScript
   - The local `@vampirecoder/template-editor` package from the parent directory

2. **Verify the package is installed:**
   ```bash
   npm list @vampirecoder/template-editor
   ```

   You should see it listed as `file:..` (pointing to the parent directory)

### Running the Demo

**Start the development server:**
```bash
npm run dev
```

The application will open automatically at `http://localhost:5173`

**Build for production:**
```bash
npm run build
```

**Preview the production build:**
```bash
npm run preview
```

## 🎯 What the Demo Tests

### 1. **Component Import**
The demo imports the `TemplateEditor` component and related types:
```typescript
import { TemplateEditor, TemplateSaveOutput, TEditorConfiguration } from '@vampirecoder/template-editor'
```

### 2. **Initial Data**
The demo passes a sample email template as `initialJson`:
```typescript
const SAMPLE_TEMPLATE: TEditorConfiguration = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F5F5F5',
      canvasColor: '#FFFFFF',
      textColor: '#262626',
      fontFamily: 'MODERN_SANS',
      childrenIds: [],
    },
  },
  subject: 'Welcome to Template Editor',
}
```

### 3. **Props and Feature Toggles**
The demo demonstrates all available props:
```typescript
<TemplateEditor
  initialJson={SAMPLE_TEMPLATE}
  onSave={handleSave}
  showJsonTab={showJsonTab}           // Toggle JSON tab visibility
  showDownloadButton={true}           // Show download button
  showImportButton={true}             // Show import button
  showSettingsButton={true}           // Show settings button
  height="600px"                      // Custom height
/>
```

### 4. **Save Callback**
The demo captures and displays the save output:
```typescript
const handleSave = (output: TemplateSaveOutput) => {
  console.log('Template saved:', output)
  setSaveOutput(output)
}
```

The `TemplateSaveOutput` contains:
- `htmlOutput`: Rendered HTML of the template
- `jsonOutput`: Template data in JSON format
- `subjectOutput`: Email subject line

### 5. **Feature Toggle**
A checkbox allows toggling the JSON tab visibility:
```typescript
<input
  type="checkbox"
  checked={showJsonTab}
  onChange={(e) => setShowJsonTab(e.target.checked)}
/>
```

## 📁 Project Structure

```
demo/
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main component using TemplateEditor
│   ├── App.css           # Component styles
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies (includes local template-editor)
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # TypeScript config for Vite
├── vite.config.ts        # Vite configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔍 Verification Checklist

When running the demo, verify:

- [ ] Application starts without errors
- [ ] TemplateEditor component renders correctly
- [ ] All UI buttons are visible (Download, Import, Settings)
- [ ] JSON tab toggle works (checkbox shows/hides JSON tab)
- [ ] Can edit the template in the editor
- [ ] Save button works and triggers `onSave` callback
- [ ] Console shows save output with htmlOutput, jsonOutput, subjectOutput
- [ ] Output section displays the saved data
- [ ] No TypeScript errors in the IDE
- [ ] No console errors in the browser

## 🐛 Troubleshooting

### Package not found error
**Problem:** `Cannot find module '@vampirecoder/template-editor'`

**Solution:**
1. Ensure the main project is built: `npm run build` in the parent directory
2. Run `npm install` in the demo directory
3. Check that `node_modules/@vampirecoder/template-editor` exists

### Port already in use
**Problem:** `Port 5173 is already in use`

**Solution:**
Vite will automatically try the next available port (5174, 5175, etc.)

### TypeScript errors
**Problem:** TypeScript errors about missing types

**Solution:**
1. Run `npm install` to ensure all dependencies are installed
2. Restart the TypeScript server in your IDE
3. Check that `tsconfig.json` includes the correct lib settings

### Build fails
**Problem:** Build command fails

**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure the main project is built first

## 📚 Related Documentation

- Main project: See `../README.md`
- NPM package plan: See `../IMPLEMENTATION_COMPLETE.md`
- Package exports: See `../src/index.ts`

## 🎓 Learning Resources

This demo shows how to:
1. Install a local npm package using `file:..` path
2. Use TypeScript with React and Vite
3. Import and use a complex React component
4. Handle callbacks and state management
5. Work with TypeScript types from external packages

## 📝 Notes

- The demo uses the same Vite + React + TypeScript stack as the main project
- The package is installed from the parent directory using a relative file path
- All TypeScript types are properly exported and available for autocomplete
- The demo is self-contained and can be used as a template for other projects

## 🤝 Contributing

To test changes to the template-editor package:
1. Make changes in the main project
2. Run `npm run build` in the main project
3. The demo will automatically use the updated build
4. Restart the dev server if needed

---

**Happy testing! 🎉**

