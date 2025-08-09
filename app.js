// The string stores the name of files added till now
var filesAdded = ''; 

//alert(663);

// For loading JS file
function loadJS(url){ 
  //alert(url);
    // Gives -1 when the given input is not in the string
    // i.e this file has not been added
      
    if(filesAdded.indexOf(url) !== -1)
        return
          
    // Head tag
    var head = document.getElementsByTagName('head')[0] 
      
    // Creating script element
    var script = document.createElement('script') 
    script.src = url
    script.type = 'text/javascript'
    script.defer = true;
	script.async = false;
    // Adding script element
    head.append(script) 
      
     // Adding the name of the file to keep record
    filesAdded += ' ';
    filesAdded += url;
    //alert(url);
}

function loadMJS(url){ 
  //alert(url);
    // Gives -1 when the given input is not in the string
    // i.e this file has not been added
      
    if(filesAdded.indexOf(url) !== -1)
        return
          
    // Head tag
    var head = document.getElementsByTagName('head')[0] 
      
    // Creating script element
    var script = document.createElement('script') 
    script.src = url
    script.type = 'module'
    script.defer = true;
	script.async = false;
    // Adding script element
    head.append(script) 
      
     // Adding the name of the file to keep record
    filesAdded += ' ';
    filesAdded += url;
    //alert(url);
}

// To load CSS file
function loadCSS(url) { 
  
    if(filesAdded.indexOf(url) !== -1)
        return
  
    var head = document.getElementsByTagName('head')[0]
      
    // Creating link element
    var style = document.createElement('link') 
    style.href = url;
    style.type = 'text/css'
    style.rel = 'stylesheet'
    head.append(style);
      
    filesAdded += ' ';
    filesAdded += url;
}

function loadFiles(urls, suffix, type){
if(suffix==='.css'){
    for(let i = 0;i < urls.length;i++){
loadCSS(urls[i]);
}
}
else if(suffix==='.js' && type == 'module'){
    for(let i = 0;i < urls.length;i++){
loadMJS(urls[i]);
}
}
else if(suffix==='.js'){
    for(let i = 0;i < urls.length;i++){
loadJS(urls[i]);
}
}

}

function readFileAsUrl(file){
                return new Promise(function(resolve,reject){
                    let fr = new FileReader();

                    fr.onload = function(){
                        resolve(fr.result);
                    };

                    fr.onerror = function(){
                        reject(fr);
                    };

                    fr.readAsDataURL(file);
                });
}

function readAndLoadFiles(files0, suffix){
    
let files = [];
for(let i = 0;i < files0.length;i++){
    let file = files0[i];
if(suffix==='.css'){
    if(file.name.endsWith(suffix))files.push(file);
}else if(suffix==='.js'){
    if(file.name.endsWith(suffix))files.push(file);
    if(file.name.lastIndexOf('.')==-1)files.push(file);
}
}

updateImageDisplay(files, 0);

let urls = [];

// Store promises in array
for(let i = 0;i < files.length;i++){
urls.push(readFileAsUrl(files[i]));
}
                
// Trigger Promises
Promise.all(urls).then((values) => { loadFiles(values, suffix);  });
}

function chooseJs(ev){
                let files = ev.currentTarget.files;

// Abort if there were no files selected
if(!files.length) return;

readAndLoadFiles(files,'.css');  
readAndLoadFiles(files,'.js');
}

function updateImageDisplay(files, clear) {
    const preview = document.querySelector('.preview');
    if(clear)while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
      }

      const curFiles = files;
      if(curFiles.length > 0) {
        const list = document.createElement('ol');
        preview.appendChild(list);

        for(const file of curFiles) {
          const listItem = document.createElement('li');
          const para = document.createElement('p');

          if(validFileTypeTxt(file)) {
            para.textContent = `文件名 ${file.name}, 文件大小 ${returnFileSize(file.size)}.`;
            listItem.appendChild(para);
          } else {
            para.textContent = `文件名无效 ${file.name}. 请重新选择.`;
            listItem.appendChild(para);
          }

          list.appendChild(listItem);
        }
      }
    }

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
    const fileTypesTxt = [
        'text/plain',
        'text/javascript',
         'text/css'
    ];
    
    function validFileTypeTxt(file) {
        return 1;
        //alert(file.type);
      //return fileTypesTxt.includes(file.type);
    }

    function returnFileSize(number) {
      if(number < 1024) {
        return number + 'bytes';
      } else if(number > 1024 && number < 1048576) {
        return (number/1024).toFixed(1) + 'KB';
      } else if(number > 1048576) {
        return (number/1048576).toFixed(1) + 'MB';
      }
    }
    
function closeCB(fc, ft, ff) {
    document.getElementById("overlay").hidden = true;
    rmCBL(fc, ft, ff);
  }
  
  function confirmCB(answer, cb1, cb2, fc, ft, ff) {
    closeCB(fc, ft, ff);
    if (answer) {
    if(cb1)cb1();
    } else {
        if(!cb2)return;
       var cf = document.getElementById("chooseFile");
       cf.addEventListener('change', (ev) => {let files = ev.currentTarget.files; cb2(files); });
       cf.click();
    }
  }

function rmCBL(fc, ft, ff){
document.getElementById("closeConfirmBox").removeEventListener("click", fc);
document.getElementById("isConfirmTrue").removeEventListener("click", ft);
document.getElementById("isConfirmFalse").removeEventListener("click", ff);
}

function showCB(s0, s1, s2, cb1, cb2) {

document.getElementById("overlay").hidden = false;

const fc = (ev)=>{
closeCB(fc, ft, ff); };

const ft = (ev)=>{
confirmCB(true, cb1, cb2, fc, ft, ff); };

const ff = (ev)=>{
confirmCB(false, cb1, cb2, fc, ft, ff); };

let btnT = document.getElementById("isConfirmTrue");
let btnF = document.getElementById("isConfirmFalse");

document.getElementById("isConfirmContent").innerText = s0;
btnT.innerHTML = s1;
btnF.innerHTML = s2;

document.getElementById("closeConfirmBox").addEventListener("click", fc);

btnT.addEventListener("click", ft);

btnF.addEventListener("click", ff);

}

