function progressUpdate(packet){
	var log = document.getElementById('log');

	if(log.firstChild && log.firstChild.status === packet.status){
		if('progress' in packet){
			var progress = log.firstChild.querySelector('progress')
			progress.value = packet.progress
		}
	}else{
		var line = document.createElement('div');
		line.status = packet.status;
		var status = document.createElement('div')
		status.className = 'status'
		status.appendChild(document.createTextNode(packet.status))
		line.appendChild(status)

		if('progress' in packet){
			var progress = document.createElement('progress')
			progress.value = packet.progress
			progress.max = 1
			line.appendChild(progress)
		}


		if(packet.status == 'done'){
			var pre = document.createElement('pre')
			pre.appendChild(document.createTextNode(packet.data.data.text))
			line.innerHTML = ''
			line.appendChild(pre)

		}

		log.insertBefore(line, log.firstChild)
	}
}

function getLangPath() {
//var s = './lang-data/4.0.0';
var s = '.';
var accuracy = document.querySelector('#accuracy').value;
if(accuracy>6){
s = "https://tessdata.projectnaptha.com/4.0.0";
accuracy-=6; 
}
if(accuracy>3){
s = "https://math-examples.github.io/tesseract-ocr-data/4.0.0";
accuracy-=3; 
}
if(accuracy=='1')s+='_fast';
else if(accuracy=='3')s+='_best';
return s;
}

let worker;
let gpath;
async function myCreateWorker() {
gpath = getLangPath();
    worker = await Tesseract.createWorker({
    workerPath: './worker.min.js',
    langPath: gpath,
    corePath: './tesseract-core.wasm.js',
    logger: progressUpdate,
        });
}


let pdf;
window.recognizeFile = async (file) => {
	document.querySelector("#log").innerHTML = '';
	
const isPdf = document.querySelector("#pdf-switch").checked;

if(getLangPath()!=gpath){
await worker.terminate();
await myCreateWorker();
}
  const lang = document.querySelector('#langsel').value

  await worker.loadLanguage(lang);
  await worker.initialize(lang);
if(!isPdf){
    const data = await worker.recognize(file);
    progressUpdate({ status: 'done', data});
}else{
    const data = await worker.recognize(file,{pdfTitle: "Example PDF"},{pdf: true});
    pdf = data.data.pdf;
    const dlBtn = document.getElementById('download-pdf');
    dlBtn.disabled = false;
    progressUpdate({ status: 'done', data});
}
};

      
async function recognizeFileNaive(file) {
	document.querySelector("#log").innerHTML = '';

  const lang = document.querySelector('#langsel').value
  const data = await Tesseract.recognize(file, lang, {
    workerPath: './worker.min.js',
    langPath: './lang-data/4.0.0',
    corePath: './tesseract-core.wasm.js',
    logger: progressUpdate,
  });
  
  progressUpdate({ status: 'done', data });
}

const downloadPDF = async () => {
        const filename = 'tesseract-ocr-result.pdf';
        const blob = new Blob([new Uint8Array(pdf)], { type: 'application/pdf' });
        if (navigator.msSaveBlob) {
          // IE 10+
          navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
};

async function setupListeners() {
    let btn = document.querySelector('#downloadAndLoadFiles');
    btn.innerHTML = '初始化中...';
    await myCreateWorker();
    btn.innerHTML = '初始化完毕';
    btn.disabled = true;
    
    const dlBtn = document.getElementById('download-pdf');
    dlBtn.addEventListener('click', downloadPDF);
}

setupListeners();
