# CLM Platform - Week 3 Features: Complete User & Developer Guide

## 🎯 Feature Overview

This guide explains **how to use** all the Week 3 search, repository, and semantic features.

---

## **1. FULL-TEXT SEARCH** (Keyword-Based)

### What It Does
Searches for **exact words and phrases** in contract text—like Google search but for contracts.

### How to Use It (As a User)

#### Step 1: Open Search Page
```
Navigate to: http://localhost:3000/search
```

#### Step 2: Enter Your Search Query
```
Examples:
• "indemnity clause"
• "penalty"
• "confidentiality"
• "payment terms"
```

#### Step 3: Select "Keyword" Search Type
```
Click the button that says "🔍 Keyword"
This uses fast, exact word matching
```

#### Step 4: Click "Search Contracts"
Results appear instantly with exact phrase matches highlighted

### Code Implementation (Developer)

```typescript
// In app/components/SearchBar.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Calls the API with full-text search type
  const response = await client.search(input, {
    type: 'full-text'
  })
  
  setResults(response.data)
}
```

### Backend API Endpoint
```
POST http://127.0.0.1:8000/api/search/full-text/

Body:
{
  "query": "indemnity clause",
  "filters": {
    "status": ["Approved"],
    "type": ["NDA"],
    "dateRange": "2025"
  }
}

Response:
{
  "success": true,
  "results": [
    {
      "id": "contract_123",
      "title": "NDA with Acme Corp",
      "preview": "...indemnity clause text...",
      "relevance_score": 0.95,
      "status": "Approved"
    }
  ]
}
```

---

## **2. FACETED FILTERING**

### What It Does
Narrow down search results by clicking filter categories on the left sidebar.

### How to Use It (As a User)

#### Step 1: Perform a Search
```
Search for something like "confidentiality"
Get 50+ results
```

#### Step 2: Click Filters on Left Sidebar
The filter panel shows:
- **Status**: Draft, Pending, Approved, Rejected, Executed
- **Contract Type**: NDA, Service Agreement, Employment, etc.
- **Date Range**: Last Week, Last Month, Last Year, Custom
- **Parties**: Client names, vendors, teams

#### Step 3: Select Filters
```
Example:
  ☑ Status: Approved
  ☑ Contract Type: NDA
  ☑ Date Range: Last Month
  ☐ Parties: (unchecked)
```

#### Step 4: Results Auto-Update
Results instantly filter down to 12 approved NDAs from last month

### Code Implementation

```typescript
// In app/components/FilterPanel.tsx
const handleFilterChange = (section: string, value: string, checked: boolean) => {
  const updated = { ...filters }
  
  if (checked) {
    updated[section].push(value)
  } else {
    updated[section] = updated[section].filter(v => v !== value)
  }
  
  onChange(updated) // Auto-triggers search with new filters
}
```

### Usage Flow Diagram
```
User enters query → 50 results

User selects:
  Status = Approved
  Type = NDA
  
Search API called with:
{
  "query": "confidentiality",
  "filters": {
    "status": ["Approved"],
    "type": ["NDA"]
  }
}

↓

12 filtered results displayed
```

---

## **3. SEMANTIC SEARCH** (AI-Smart Search)

### What It Does
Understands **meaning**, not just keywords. Finds contracts by intent, concept, and related terms.

### Key Differences: Keyword vs Semantic

```
Search: "Payment obligations"

KEYWORD (Full-Text) finds:
✓ Exact match: "payment obligations"
✗ Misses: "billing terms", "invoicing", "financial responsibility"

SEMANTIC (AI) finds:
✓ Exact match: "payment obligations"
✓ Similar meaning: "billing terms"
✓ Related concept: "invoicing"
✓ Associated term: "financial responsibility"
```

### How to Use It (As a User)

#### Step 1: Open Search Page
```
http://localhost:3000/search
```

#### Step 2: Click "✨ AI-Smart" Button
```
This enables semantic search mode
```

#### Step 3: Enter Natural Language Query
```
Examples:
• "Find contracts about money transfers"
• "Show me agreements with strict penalties"
• "Which contracts allow early termination?"
• "Contracts with high liability risks"
```

#### Step 4: Get Intelligent Results
System understands the intent behind your question and returns conceptually related contracts

### Code Implementation

```typescript
// In SearchBar.tsx
const handleSemanticSearch = async (query: string) => {
  const response = await client.semanticSearch(query)
  // Uses AI embeddings to find conceptually similar contracts
  setResults(response.data)
}

// In api-client.ts
async semanticSearch(query: string): Promise<ApiResponse> {
  return this.request(
    'GET',
    `/api/search/semantic/?q=${encodeURIComponent(query)}`
  )
}
```

### Backend Flow
```
User enters: "payment terms"

Backend:
1. Convert text to vector embedding (numerical representation)
2. Compare with stored contract embeddings
3. Find N most similar contracts
4. Rank by similarity score
5. Return top results

API Endpoint:
GET http://127.0.0.1:8000/api/search/semantic/?q=payment%20terms

Response:
{
  "results": [
    {
      "id": "contract_45",
      "title": "Service Agreement with XYZ",
      "relevance_score": 0.92,
      "similarity": "high"
    },
    {
      "id": "contract_67",
      "title": "Vendor Contract",
      "relevance_score": 0.85,
      "similarity": "high"
    }
  ]
}
```

---

## **4. HYBRID SEARCH**

### What It Does
Combines **keyword accuracy** + **semantic intelligence** for best results.

### How to Use It (As a User)

#### Step 1: Click "⚡ Hybrid" Button
```
This is the default and recommended mode
```

#### Step 2: Search Normally
```
Query: "liability insurance"
```

#### Step 3: Get Best of Both Worlds
Results include:
- **Exact matches**: Contracts with "liability insurance" text
- **Semantic matches**: Contracts about risk coverage, indemnity, insurance

### Real Example

```
Query: "How do we handle payment disputes?"

Hybrid Search returns:

1. (Keyword Match) "Payment Dispute Resolution" contract
   Score: 0.98

2. (Semantic Match) "Service Level Agreement with SLA penalties"
   Score: 0.87

3. (Semantic Match) "Liability and Indemnification Clause"
   Score: 0.82

4. (Keyword Match) "Invoice Dispute Process"
   Score: 0.91
```

---

## **5. CENTRAL REPOSITORY**

### What It Does
Shows **all contracts** in your system in an organized, browsable view.

### How to Use It (As a User)

#### Step 1: Navigate to Repository
```
http://localhost:3000/contracts
```

#### Step 2: View Contracts
Two viewing modes available:

**Grid View** (Default)
```
┌─────────────┬─────────────┬─────────────┐
│  NDA with   │ Service     │ Employment  │
│  Acme Corp  │ Agreement   │ Contract    │
│ Status: ✓   │ Status: ⏳  │ Status: ✗   │
└─────────────┴─────────────┴─────────────┘
```

**List View**
```
► NDA with Acme Corp          Status: Approved    Updated: Jan 10
► Service Agreement           Status: Pending     Updated: Jan 8
► Employment Contract         Status: Rejected    Updated: Jan 5
```

#### Step 3: Click a Contract to View Details
```
Opens: http://localhost:3000/contracts/[contract_id]
Shows full contract details
```

#### Step 4: Create New Contract
```
Click "➕ New Contract" button
Opens: http://localhost:3000/create-contract
```

### Code Implementation

```typescript
// In app/contracts/page.tsx
export default function ContractsPage() {
  const [contracts, setContracts] = useState([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchContracts = async () => {
      const client = new ApiClient()
      const response = await client.getContracts()
      setContracts(response.data || [])
    }
    fetchContracts()
  }, [])

  return (
    <div>
      {/* View toggle buttons */}
      <button onClick={() => setViewMode('grid')}>Grid</button>
      <button onClick={() => setViewMode('list')}>List</button>

      {/* Display contracts based on viewMode */}
      <div className={viewMode === 'grid' ? 'grid gap-6' : 'space-y-4'}>
        {contracts.map(contract => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>
    </div>
  )
}
```

---

## **6. FIND SIMILAR CONTRACTS**

### What It Does
Finds contracts similar to the one you're currently viewing using AI.

### How to Use It (As a User)

#### Step 1: Open Any Contract
```
http://localhost:3000/contracts/[contract_id]
```

#### Step 2: Click "✨ Find Similar Contracts" Button
```
Located at the top of the contract
```

#### Step 3: View Similar Results
System displays contracts with similar:
- Content and clauses
- Structure and format
- Legal terms and conditions
- Parties/vendors involved

### Use Cases

```
Use Case 1: Precedent Research
• Open your NDA template
• Click "Find Similar"
• Review 10 past NDAs
• Identify best practices

Use Case 2: Consistency Checking
• Found inconsistency in one contract
• Click "Find Similar"
• Check if other contracts have the same issue
• Fix across portfolio

Use Case 3: Contract Reuse
• Need to create new vendor agreement
• Find and open similar old contract
• Click "Find Similar"
• Review similar contracts for templates
• Adapt to new vendor
```

### Code Implementation

```typescript
// In app/contracts/[id]/page.tsx
const handleFindSimilar = async () => {
  setFindingSimilar(true)
  try {
    const client = new ApiClient()
    // Calls semantic search with contract title/content
    const response = await client.semanticSearch(contract.title)
    setSimilarContracts(response.data || [])
  } catch (error) {
    console.error('Failed to find similar contracts:', error)
  } finally {
    setFindingSimilar(false)
  }
}

// Backend API Endpoint:
// GET /api/contracts/[id]/similar/
// Returns 5-10 most similar contracts
```

---

## **7. OCR & DOCUMENT UPLOAD**

### What It Does
Uploads contracts (including scanned PDFs) and automatically extracts text so they're searchable.

### How to Use It (As a User)

#### Step 1: Navigate to Upload
```
Go to: http://localhost:3000/contracts
Look for "Upload Contract" button
```

#### Step 2: Drag & Drop or Click to Select File
```
Supported formats:
✓ PDF (including scanned images)
✓ DOCX, DOC
✓ PNG, JPG, JPEG (will be OCR'd)
```

#### Step 3: Wait for Processing
```
Progress bar shows:
"Uploading and processing..."

Backend automatically:
1. Stores file
2. Extracts text (OCR for images)
3. Creates searchable index
4. Generates AI embeddings
```

#### Step 4: Contract Now Searchable
```
Once complete, the contract:
✓ Appears in repository
✓ Searchable via full-text search
✓ Findable via semantic search
✓ Can use "Find Similar" feature
```

### Code Implementation

```typescript
// In app/components/DocumentUpload.tsx
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const client = new ApiClient()
    const response = await client.uploadDocument(formData)
    // Response includes extracted metadata
    console.log('Contract uploaded:', response.data)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

// Backend Endpoint:
// POST /api/documents/upload/
// Multipart form data with 'file' field
```

---

## **8. SEARCH RESULTS RANKING**

### What It Does
Results are ranked by **relevance score** - how well they match your search.

### How to Interpret Scores

```
100% Match:
Exact phrase found, perfectly relevant

80-99% Match:
High relevance, closely related content

60-79% Match:
Good relevance, useful context

40-59% Match:
Moderate relevance, tangentially related

Below 40%:
Low relevance, consider refining search
```

### Example Results Display

```
Found 47 results

1. NDA with Acme Corp                      98% Match ████████░
   Preview: "...indemnity clause states..."
   Updated: Jan 10  |  Status: Approved

2. Service Agreement Template               85% Match ███████░░
   Preview: "...indemnification and liability..."
   Updated: Dec 28  |  Status: Approved

3. Employment Contract - Standard            72% Match ██████░░░
   Preview: "...hold harmless clause..."
   Updated: Dec 15  |  Status: Draft
```

---

## **9. NATURAL LANGUAGE QUERIES**

### What It Does
Write questions in plain English instead of database syntax.

### Examples of Smart Queries

```
Query: "Show me contracts with aggressive payment terms"
System understands: Payment terms, aggressive = strict/harsh
Returns: Contracts with quick payment requirements

Query: "Which contracts have non-compete clauses?"
System understands: Non-compete = restriction on working for competitors
Returns: All contracts with non-compete restrictions

Query: "Find agreements with high liability caps"
System understands: Liability caps = maximum financial responsibility
Returns: Contracts with liability limitations

Query: "Contracts that allow early termination"
System understands: Early termination = end before agreed date
Returns: Contracts with early exit clauses
```

### How to Use

```
1. Go to Search page
2. Click "✨ AI-Smart" or "⚡ Hybrid"
3. Type your question naturally in English
4. Click Search
5. Get relevant results
```

---

## **10. DOCUMENT METADATA**

### What It Does
Stores and organizes additional information about each contract beyond just text.

### Metadata Examples

```
Contract: "NDA with Acme Corp"

Metadata:
├── File Info
│   ├── Original filename: "NDA_Acme_2025.pdf"
│   ├── Upload date: January 10, 2025
│   ├── File size: 2.5 MB
│   └── Format: PDF
├── Document Info
│   ├── Contract type: NDA
│   ├── Status: Approved
│   ├── Value: $500,000
│   └── Effective date: Jan 1, 2025
├── People
│   ├── Created by: John Smith
│   ├── Last modified by: Sarah Johnson
│   └── Assigned to: Legal Team
└── Tags
    ├── "High Priority"
    ├── "Vendor: Acme Corp"
    ├── "Active"
    └── "Reviewed"
```

### How to Add/Edit Metadata

```
1. Open contract: http://localhost:3000/contracts/[id]
2. Scroll to "Metadata" section
3. Click "Edit"
4. Add tags, assign to team members, set priority
5. Save
```

---

## **QUICK START: 5-Minute Tour**

### 1. Search for Contracts (2 min)
```
1. Go to http://localhost:3000/search
2. Type "confidentiality"
3. Click "⚡ Hybrid"
4. See results with relevance scores
```

### 2. Filter Results (1 min)
```
1. Left sidebar shows filters
2. Click ☑ Status: Approved
3. Click ☑ Type: NDA
4. Results auto-update
```

### 3. Find Similar Contracts (2 min)
```
1. Click on any result
2. Opens contract detail page
3. Click "✨ Find Similar Contracts"
4. See 5-10 similar contracts
```

---

## **TROUBLESHOOTING**

### Search Returns No Results
```
✓ Try fewer filter criteria
✓ Use broader keywords
✓ Switch from Keyword to Hybrid search
✓ Check that contracts are uploaded and indexed
```

### Semantic Search Seems Slow
```
✓ First search takes longer (indexing)
✓ Subsequent searches are cached
✓ Normal response time: 1-2 seconds
✓ Check backend is running on http://127.0.0.1:8000
```

### Uploaded PDF Not Searchable
```
✓ Wait for OCR processing (30-60 seconds)
✓ Refresh page
✓ Check backend logs for OCR errors
✓ Verify PDF is readable (not corrupted)
```

### "Find Similar" Returns No Results
```
✓ Contract might be very unique
✓ System is still building embeddings
✓ Try different contract
✓ Check vector database is configured
```

---

## **API REFERENCE FOR DEVELOPERS**

### Full-Text Search
```
POST /api/search/full-text/
{
  "query": "liability clause",
  "filters": { "status": ["Approved"] }
}
```

### Semantic Search
```
GET /api/search/semantic/?q=payment%20terms
```

### Hybrid Search
```
POST /api/search/hybrid/
{
  "query": "indemnity",
  "filters": { "type": ["NDA"] }
}
```

### Get Contracts
```
GET /api/contracts/
GET /api/contracts/[id]/
```

### Find Similar
```
GET /api/contracts/[id]/similar/
```

### Upload Document
```
POST /api/documents/upload/
(multipart/form-data with 'file')
```

---

**Ready to use these features? Start with the Search page and try all three search modes!**
