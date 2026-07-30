document.addEventListener("DOMContentLoaded", () => {

const API_URL = "http://127.0.0.1:8000";

// DOM ELEMENTS
const pdfFiles = document.getElementById("pdfFiles");
const uploadBtn = document.getElementById("uploadBtn");
const processBtn = document.getElementById("processBtn");
const askBtn = document.getElementById("askBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const uploadStatus = document.getElementById("uploadStatus");
const processStatus = document.getElementById("processStatus");

const question = document.getElementById("question");
const answer = document.getElementById("answer");


const pdfCount = document.getElementById("pdfCount");
const chunkCount = document.getElementById("chunkCount");
const processingTime = document.getElementById("processingTime");
const modelName = document.getElementById("modelName");

const uploadedFiles =
document.getElementById("uploadedFiles");

const loadingModal =
document.getElementById("loadingModal");

const toast =
document.getElementById("toast");

const progressFill =
document.getElementById("progressFill");

const heroUploadBtn =
document.getElementById("heroUploadBtn");

let chatHistory = [];
let selectedFiles = [];
let totalStartTime = 0;

// =====================================================
// HERO BUTTON
// =====================================================

if(heroUploadBtn){

    heroUploadBtn.addEventListener("click",()=>{

        pdfFiles.click();

    });

}

// =====================================================
// LOADING
// =====================================================

function showLoading(message = "Processing...") {

    if (!loadingModal) return;

    loadingModal.style.display = "flex";

    // Update loading message
    const text = loadingModal.querySelector(".loading-message");

    if (text) {
        text.innerHTML = message;
    }

    // Animate progress bar
    const bar = loadingModal.querySelector(".progress-bar");

    if (bar) {

        // Reset
        bar.style.transition = "none";
        bar.style.width = "0%";

        // Force browser repaint
        bar.offsetWidth;

        // Animate to 100%
        bar.style.transition = "width 8s linear";
        bar.style.width = "100%";
    }

}

function hideLoading() {

    if (!loadingModal) return;

    // Reset progress bar
    const bar = loadingModal.querySelector(".progress-bar");

    if (bar) {
        bar.style.transition = "none";
        bar.style.width = "0%";
    }

    loadingModal.style.display = "none";

}

// =====================================================
// TOAST
// =====================================================

function showToast(message,color="#2563eb"){

    if(!toast){

        alert(message);

        return;

    }

    toast.innerHTML=message;

    toast.style.background=color;

    toast.style.display="block";

    setTimeout(()=>{

        toast.style.display="none";

    },3000);

}
function renderSelectedFiles() {

    if (selectedFiles.length === 0) {

        uploadStatus.innerHTML = "";
        return;

    }

    let html = "<strong>Selected Files</strong><br><br>";

    selectedFiles.forEach((file, index) => {

        html += `
        <div class="selected-file">

            📄 ${file.name}
            (${formatSize(file.size)})

            <button
            type="button"
            class="remove-file"
            data-index="${index}">
            ❌
            </button>
                

        </div>
        `;

    });

    uploadStatus.innerHTML = html;
    document.querySelectorAll(".remove-file").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = Number(this.dataset.index);
            selectedFiles.splice(index, 1);
            renderSelectedFiles();
        });
    });

    showToast(`${selectedFiles.length} PDF Selected`);

}
// =====================================================
// FILE SIZE
// =====================================================

function formatSize(bytes){

    if(bytes<1024){

        return bytes+" B";

    }

    if(bytes<1024*1024){

        return (bytes/1024).toFixed(2)+" KB";

    }

    return (bytes/(1024*1024)).toFixed(2)+" MB";

}

// =====================================================
// FILE SELECT
// =====================================================

if (pdfFiles) {

    pdfFiles.addEventListener("change", () => {

        const newFiles = Array.from(pdfFiles.files);

        // Maximum 5 PDFs
        if (selectedFiles.length + newFiles.length > 5) {

            showToast("Maximum 5 PDFs allowed", "#ef4444");
            pdfFiles.value = "";
            return;

        }

        // Add only unique files
        newFiles.forEach(file => {

            const exists = selectedFiles.some(
                f => f.name === file.name && f.size === file.size
            );

            if (!exists) {
                selectedFiles.push(file);
            }

        });

        renderSelectedFiles();

        pdfFiles.value = "";

    });

}

// =====================================================
// UPLOAD
// =====================================================

if(uploadBtn){

uploadBtn.addEventListener("click",uploadPDFs);

}

async function uploadPDFs(){

    if(selectedFiles.length===0){

        showToast("Please select PDF files","#ef4444");

        return;

    }
    totalStartTime = performance.now();

    uploadBtn.disabled=true;

    showLoading("Uploading PDF Documents...");

    const formData=new FormData();

    selectedFiles.forEach(file=>{
        formData.append("files",file);
    });

    try{

        const response=await fetch(API_URL+"/upload/",{

            method:"POST",

            body:formData

        });

        if(!response.ok){
            throw new Error("Backend Error");
        }

        const data=await response.json();

        if(data.status!=="success"){

            hideLoading();

            uploadBtn.disabled=false;

            uploadStatus.innerHTML="Upload Failed";

            showToast("Upload Failed","#ef4444");

            return;

        }

        uploadStatus.innerHTML="✅ Upload Successful";

        if(uploadedFiles){

            uploadedFiles.innerHTML="";

            data.uploaded_files.forEach(file=>{

                uploadedFiles.innerHTML+=`

                <div class="source-card">

                    📄 ${file}

                </div>

                `;

            });

        }

        if(pdfCount){

            pdfCount.textContent=data.uploaded_files.length;

        }

        showToast("Upload Successful","#22c55e");

        await processDocuments();
        selectedFiles = [];
        renderSelectedFiles();
        pdfFiles.value="";

    }

    catch(err){

        console.log(err);

        hideLoading();

        uploadBtn.disabled=false;

        uploadStatus.innerHTML="Upload Failed";

        showToast("Upload Maximum 5 PDFs","#ef4444");

    }

}

// =====================================================
// PROCESS DOCUMENTS
// =====================================================

async function processDocuments(){
    if(processStatus){
        processStatus.innerHTML="Processing Documents...";
    }

    showLoading("Extracting Text...");

    if(progressFill){

        progressFill.style.width="0%";

    }

    let progress=0;

    const timer=setInterval(()=>{

        progress+=2;

        if(progress<=90 && progressFill){

            progressFill.style.width=progress+"%";

        }

    },120);

    try{

        const response=await fetch(API_URL+"/process/",{

            method:"POST"

        });

        clearInterval(timer);

        const data=await response.json();

        console.log("PROCESS RESPONSE:",data);

        if(progressFill){

            progressFill.style.width="100%";

        }
        if(processStatus){
            processStatus.innerHTML="✅ Documents Processed";
        }

        if(chunkCount){

            chunkCount.textContent=data.chunks;

        }

       

        if(modelName){

            modelName.textContent=
            data.model || "llama3.2:3b";

        }

        if(pdfCount){

            pdfCount.textContent=data.documents;

        }

        showToast("Documents Ready","#22c55e");

        showLoading("Generating Executive Summary...");

        await generateSummary();
        if(processingTime){
            const totalTime =
            (performance.now() - totalStartTime) / 1000;
            processingTime.textContent =totalTime.toFixed(2) + " s";
        }

        hideLoading();

        uploadBtn.disabled=false;

    }

    catch(err){

        clearInterval(timer);

        console.log(err);

        hideLoading();

        uploadBtn.disabled=false;
        if(processStatus){
            processStatus.innerHTML="Processing Failed";
        }

        showToast("Processing Failed","#ef4444");

    }

}

// =====================================================
// PART 2 STARTS FROM HERE
// =====================================================

// =====================================================
// GENERATE EXECUTIVE SUMMARY
// =====================================================

async function generateSummary() {
    console.log("generateSummary() called");

    // Show loading in AI Response
    answer.innerHTML = `
    <div class="ai-response">
        <div class="loader"></div>
        <h2>Generating Executive Summary...</h2>
        <p>Please wait...</p>
    </div>
    `;

   

    try {

        const response = await fetch(API_URL + "/chat/", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                question: "Generate a complete executive summary of all uploaded PDF documents."

            })

        });

        const data = await response.json();

        console.log("SUMMARY RESPONSE:", data);

        // -------------------------------
        // Display in AI Response panel
        // -------------------------------
        console.log("Answer:", data.answer);
        console.log("Summary:", data.summary);
        const summary = data.summary || data.answer;
        displayAnswer(summary);
        const summaryBox = document.getElementById("summaryBox");
        if (summaryBox) {
            summaryBox.innerHTML = `
            <div class="answer-text">
            ${marked.parse(summary)}
        </div>
        `;
    }

        
        

       
        // -------------------------------
        // Save in chat history
        // -------------------------------
        chatHistory.push({

            question: "Executive Summary",

            answer: data.answer

        });

        updateHistory();

        showToast("Executive Summary Generated", "#22c55e");

    }

    catch (err) {

        console.log(err);

        answer.innerHTML = `
        <div class="ai-response">
            <h2 style="color:red">
                Unable to Generate Executive Summary
            </h2>
        </div>
        `;

        // Also update Executive Summary box
        const summaryBox = document.getElementById("summaryBox");

        if (summaryBox) {

            summaryBox.innerHTML = `
                <div class="welcome-box">
                    <h3>Summary Generation Failed</h3>
                    <p>Please try uploading the documents again.</p>
                </div>
            `;

        }

        showToast("Summary Generation Failed", "#ef4444");

    }

}

// =====================================================
// ASK BUTTON
// =====================================================

if (askBtn) {

    askBtn.addEventListener("click", askAI);

}

// =====================================================
// ENTER KEY
// =====================================================

if (question) {

    question.addEventListener("keydown", (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            askAI();

        }

    });

}

// =====================================================
// ASK AI
// =====================================================

async function askAI() {

    const q = question.value.trim();

    if (q === "") {

        showToast("Please enter a question", "#ef4444");

        return;

    }

    askBtn.disabled = true;

    answer.innerHTML = `
    <div class="ai-response">

        <div class="loader"></div>

        <h2>AI is Thinking...</h2>

        <p>Please wait...</p>

    </div>
    `;

    

    try {

        const response = await fetch(API_URL + "/chat/", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                question: q

            })

        });

        const data = await response.json();

        console.log("CHAT RESPONSE:", data);
        

        askBtn.disabled = false;

        if (data.status !== "success") {

            answer.innerHTML = `
            <div class="welcome-box">

                <h2 style="color:red">

                    ${data.answer}

                </h2>

            </div>
            `;

            showToast("Answer Not Found", "#ef4444");

            return;

        }

        displayAnswer(data.answer);

        
        scrollToAnswer();

        chatHistory.push({

            question: q,

            answer: data.answer

        });

        updateHistory();

        showToast("Answer Generated", "#22c55e");

    }

    catch (err) {
        console.log(err);
        askBtn.disabled = false;
        answer.innerHTML = `
        <div class="ai-response">

            <h2 style="color:red">

                Unable to connect to backend

            </h2>

            <p>

                Please check whether FastAPI is running.

            </p>

        </div>
        `;

        showToast("Backend Connection Failed", "#ef4444");

    }

}

// =====================================================
// PART 3 STARTS FROM HERE
// =====================================================
// =====================================================
// DISPLAY AI ANSWER
// =====================================================

function displayAnswer(text) {

    if (!text || !text.trim()) {

        answer.innerHTML = `
        <div class="ai-response">
            <h2>No Answer Found</h2>
        </div>`;
        return;
    }

    // Normalize line endings
    text = text.replace(/\r\n/g, "\n");

    // Remove multiple blank lines
    text = text.replace(/\n{3,}/g, "\n\n");

    // Remove blank line between heading and list
    text = text.replace(/(#{1,6}[^\n]*)\n+\-/g, "$1\n-");

    // Remove blank line between two headings
    text = text.replace(/(#{1,6}[^\n]*)\n+(#{1,6})/g, "$1\n$2");

    // Render markdown
    let html = marked.parse(text);

    // Remove empty paragraphs generated by marked
    html = html.replace(/<p>\s*<\/p>/g, "");

    // Remove paragraph containing only &nbsp;
    html = html.replace(/<p>(&nbsp;|\s)*<\/p>/g, "");

    answer.innerHTML = `
    <div class="answer-text">
        ${html}
    </div>`;
}
// =====================================================
// RECENT QUESTIONS
// =====================================================

function updateHistory() {

    const history = document.getElementById("chatHistory");

    if (!history) return;

    history.innerHTML = "";

    if (chatHistory.length === 0) {

        history.innerHTML = `

        <div class="source-card">

            No Recent Questions

        </div>

        `;

        return;

    }

    [...chatHistory]

        .reverse()

        .forEach(chat => {

            history.innerHTML += `

            <div class="source-card">

                <strong>Question</strong>

                <hr>

                ${chat.question}

            </div>

            `;

        });

}

// =====================================================
// DISPLAY SOURCES
// =====================================================



// =====================================================
// PART 4 STARTS HERE
// =====================================================
// =====================================================
// COPY ANSWER
// =====================================================

if (copyBtn) {

    copyBtn.addEventListener("click", copyAnswer);

}

function copyAnswer() {

    const textElement = answer.querySelector(".answer-text");

    if (!textElement) {

        showToast("Nothing to Copy", "#ef4444");

        return;

    }

    const text = textElement.innerText.trim();

    navigator.clipboard.writeText(text)
     .then(()=>{
    showToast("Copied Successfully","#22c55e");
    })
    .catch(()=>{

     showToast("Copy Failed","#ef4444");

    });

}

// =====================================================
// DOWNLOAD ANSWER
// =====================================================

if (downloadBtn) {

    downloadBtn.addEventListener("click", downloadAnswer);

}

function downloadAnswer() {

    const textElement = answer.querySelector(".answer-text");

    if (!textElement) {

        showToast("Nothing to Download", "#ef4444");

        return;

    }

    const text = textElement.innerText;

    const blob = new Blob([text], {

        type: "text/plain"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "AI_Report.txt";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("Report Downloaded", "#22c55e");

}

// =====================================================
// CLEAR CHAT
// =====================================================

if (clearBtn) {

    clearBtn.addEventListener("click", clearAll);

}

function clearAll() {

    if (question) {

        question.value = "";

    }

    if (answer) {

        answer.innerHTML = `

        <div class="welcome-box">

            <h2>AI Research Assistant</h2>

            <p>

                Upload PDF documents and ask questions.

            </p>

        </div>

        `;

    }

    

    chatHistory = [];

    updateHistory();

    showToast("Workspace Cleared", "#2563eb");

}

// =====================================================
// AUTO SCROLL
// =====================================================

function scrollToAnswer() {

    answer.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}

// =====================================================
// ONLINE STATUS
// =====================================================

window.addEventListener("online", () => {

    showToast("Internet Connected", "#22c55e");

});

window.addEventListener("offline", () => {

    showToast("Internet Disconnected", "#ef4444");

});

// =====================================================
// SHORTCUTS
// =====================================================

document.addEventListener("keydown", (e) => {

    // Ctrl + Enter → Ask AI

    if (e.ctrlKey && e.key === "Enter") {

        e.preventDefault();

        askAI();

    }
    if (e.key === "Escape") {

        clearAll();

    }

});

// =====================================================
// WELCOME SCREEN
// =====================================================

if (answer) {

    answer.innerHTML = `

    <div class="welcome-box">

        <h1>🤖 AI Research Assistant</h1>

        <br>

        <p>

            Upload one or more PDF documents to begin.

        </p>

        <br>

        <ul style="text-align:left;display:inline-block;line-height:1.5;">

            <li>📄 Multi PDF Upload</li>

            <li>🔍 Hybrid Search </li>

            <li>🧠 AI Question Answering</li>

           

            

        </ul>

    </div>

    `;

}
updateHistory();

// =====================================================
// END OF SCRIPT
// =====================================================

});