# 📚 Multi-Document Research Assistant

An AI-powered **Multi-Document Research Assistant** that enables users to upload multiple PDF documents, generate concise summaries, 
ask questions, and retrieve accurate answers using **Retrieval-Augmented Generation (RAG)**. The system combines semantic search,
keyword-based retrieval, and Large Language Models (LLMs) to provide intelligent document analysis.

## ✨ Features

- 📄 Upload and process multiple PDF documents
- 🔍 OCR support for scanned PDFs using EasyOCR
- 📝 Automatic text extraction and preprocessing
- 🤖 AI-powered Question Answering
- 📑 Executive Summary Generation
- 🔎 Hybrid Retrieval using ChromaDB and BM25
- 📚 Context-aware document retrieval
- 🎯 Semantic Search with Sentence Transformers
- 💬 Ollama LLM integration for answer generation
- 🌐 Modern and responsive web interface

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Python
- FastAPI
- Uvicorn

## AI & NLP
- Ollama
- LangChain
- Sentence Transformers
- ChromaDB
- BM25
- Transformers

## OCR & PDF Processing
- PyMuPDF (fitz)
- EasyOCR
- Pillow

## Database
- ChromaDB (Vector Database)

# 📂 Project Structure

```text
Multi-Document/
│
├── backend/
│   ├── app.py
│   ├── services/
│   ├── models/
│   ├── utils/
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── uploads/
├── chroma_db/
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

"bash
git clone https://github.com/UdiitBansal/Multi-Document-Summarizer.git
cd Multi-Document-Summarizer
"

---

## 2. Create a Virtual Environment
### Windows

"bash
python -m venv venv
venv\Scripts\activate
"

### Linux / macOS
"bash
python3 -m venv venv
source venv/bin/activate
"

---

## 3. Install Dependencies

"bash
pip install -r requirements.txt
"

---

# 🤖 Install Ollama

Download and install Ollama from:

https://ollama.com

Pull the required model:

"bash
ollama pull llama3.2
"

Verify installation:
"bash
ollama list
"

---

# ▶️ Run the Backend
"bash
uvicorn backend.app:app --reload
"
The backend server will start at:

"http://127.0.0.1:8000"

---
# 🌐 Run the Frontend

Open the `index.html` file in your browser.

**OR**

Use **VS Code Live Server** for a better development experience.

---

# 📖 Usage

1. Start the FastAPI backend.
2. Open the frontend in your browser.
3. Upload one or more PDF documents.
4. Wait for document processing to complete.
5. View the generated Executive Summary.
6. Ask questions related to the uploaded documents.
7. Receive AI-generated answers with relevant document context.

# 📦 Main Dependencies

- FastAPI
- Uvicorn
- Ollama
- LangChain
- ChromaDB
- Sentence Transformers
- Transformers
- BM25
- PyMuPDF
- EasyOCR
- Pillow
- NumPy
- Scikit-learn
- Python-Multipart

Install everything with:
"bash
pip install -r requirements.txt"

---

# 🚀 Future Enhancements

- Support for Word and PowerPoint documents
- Chat history
- User authentication
- Multi-language document support
- Improved OCR accuracy
- Document comparison
- Advanced analytics dashboard

# 👨‍💻 Author

**Udiit Bansal**

PG-Diploma in Big Data Analytics (DBDA)

CDAC Bengaluru

GitHub: https://github.com/UdiitBansal
---

# 📄 License

This project is developed for educational and research purposes.
