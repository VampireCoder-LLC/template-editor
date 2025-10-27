import { useState } from 'react'
import { TemplateEditor, TemplateSaveOutput, TEditorConfiguration } from '@vampirecoder/template-editor'
import './App.css'

// Sample initial template data
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

function App() {
  const [saveOutput, setSaveOutput] = useState<TemplateSaveOutput | null>(null)
  const [showJsonTab, setShowJsonTab] = useState(false)

  const handleSave = (output: TemplateSaveOutput) => {
    console.log('Template saved:', output)
    setSaveOutput(output)
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎨 Template Editor Demo</h1>
        <p>Testing NPM package installation and functionality</p>
      </div>

      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={showJsonTab}
            onChange={(e) => setShowJsonTab(e.target.checked)}
          />
          Show JSON Tab
        </label>
      </div>

      <div className="editor-container">
        <TemplateEditor
          initialJson={SAMPLE_TEMPLATE}
          onSave={handleSave}
          showJsonTab={showJsonTab}
          showDownloadButton={true}
          showImportButton={true}
          showSettingsButton={true}
          height="600px"
        />
      </div>

      {saveOutput && (
        <div className="output-container">
          <h2>📤 Last Save Output</h2>
          <div className="output-section">
            <h3>Subject:</h3>
            <pre>{saveOutput.subjectOutput}</pre>
          </div>
          <div className="output-section">
            <h3>HTML Output (first 500 chars):</h3>
            <pre>{saveOutput.htmlOutput.substring(0, 500)}...</pre>
          </div>
          <div className="output-section">
            <h3>JSON Output:</h3>
            <pre>{JSON.stringify(saveOutput.jsonOutput, null, 2).substring(0, 500)}...</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

