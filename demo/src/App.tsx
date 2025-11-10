import { useState } from 'react'
import { TemplateEditor, TemplateSaveOutput, TEditorConfiguration, TemplateField } from '@vampirecoder/template-editor'
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

// Sample template fields for Handlebars insertion
const TEMPLATE_FIELDS: TemplateField[] = [
  {
    name: 'userName',
    label: 'User Name',
    description: 'The name of the recipient',
  },
  {
    name: 'userEmail',
    label: 'Email Address',
    description: 'The email address of the recipient',
  },
  {
    name: 'systemDateTime',
    label: 'System Date/Time',
    description: 'Current system date and time',
  },
  {
    name: 'companyName',
    label: 'Company Name',
    description: 'Your company name',
  },
  {
    name: 'supportEmail',
    label: 'Support Email',
    description: 'Support contact email',
  },
  {
    name: 'unsubscribeLink',
    label: 'Unsubscribe Link',
    description: 'Link to unsubscribe from emails',
  },
]

function App() {
  const [saveOutput, setSaveOutput] = useState<TemplateSaveOutput | null>(null)
  const [showJsonTab, setShowJsonTab] = useState(false)

  const handleSave = (output: TemplateSaveOutput) => {
    console.log('Template saved:', output)
    setSaveOutput(output)
  }

  return (
    <div className="app-container">
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
          templateFields={TEMPLATE_FIELDS}
          height="800px"
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

