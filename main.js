// main.js
const AnimalJam = require('./animaljam'); //
const aj = new AnimalJam();

var mpArr = [];
var uname = "";

window.onload = function () {
  document.getElementById("alertUser").style.display = "none";
  document.getElementById("donateShow").click();
}

function showPopup() {
  document.getElementById("donateDiv").innerHTML = `
    <div id="donate" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <h2 class="text-center">Buy me a coffee</h2>
          <div class="modal-body">
            <form action="https://www.paypal.com/cgi-bin/webscr" class="text-center" method="post">
              <input type="hidden" name="business" value="authxero@gmail.com">
              <input type="hidden" name="cmd" value="_donations">
              <input type="hidden" name="item_name" value="Buy me a coffee">
              <input type="hidden" name="item_number" value="Animal Jam Masterpiece Viewer">
              <input type="hidden" name="currency_code" value="USD">
              <input type="image" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" alt="Donate">
              <img alt="" width="1" height="1" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif">
            </form>
          </div>
          <br><br>
          <h3 class="text-center">Find a bug or have suggestions?</h3>
          <p class="text-center">Email me at authxero@gmail.com</p>
          <br><br>
          <p class="text-center">Disclaimer: This website was made for educational purposes!</p>
        </div>
      </div>
    </div>`;
}

function verifyUI() {
  console.log("verifyUI called");
  var username = document.getElementById("userToSearch").value;
  if (username.trim() !== null && username.trim() !== undefined && username.trim() !== "") {
    console.log("Username is valid");
    document.getElementById("alertUser").style.display = "none";
    document.getElementById("container1").innerHTML = `
      <h2 id="fromUser" class="mb-5"></h2>
      <div class="row" id="rows"></div>`;
    fetchMasterpieces(username);
    document.getElementById("alertUser").innerHTML = `Please wait while we retrieve ${username}'s masterpieces...`;
    document.getElementById("alertUser").style.display = "block";
    document.getElementById("search").disabled = "true";
    document.getElementById("rows").innerHTML = "";
  } else {
    console.log("Username is invalid");
    document.getElementById("alertUser").innerHTML = "Please do not leave the search bar empty!";
    document.getElementById("alertUser").style.display = "block";
  }
}

async function fetchMasterpieces(username) {
  try {
    const masterpieces = await aj.getMasterpieces(username);
    console.log(`Masterpieces for ${username}:`, masterpieces);
    displayMasterpieces(masterpieces, username);
  } catch (error) {
    console.error(`Failed to fetch masterpieces for ${username}:`, error);
    document.getElementById("alertUser").innerHTML = "Error in retrieving masterpieces! Please try again!";
    document.getElementById("alertUser").style.display = "block";
    document.getElementById("search").removeAttribute("disabled");
  }
}

function displayMasterpieces(masterpieces, username) {
  if (masterpieces.length == 0) {
    document.getElementById("alertUser").innerHTML = `No masterpieces found for ${username}!`;
    document.getElementById("alertUser").style.display = "block";
    document.getElementById("search").removeAttribute("disabled");
    document.getElementById("fromUser").innerHTML = "";
    return;
  }
  document.getElementById("fromUser").innerHTML = "Masterpieces from " + username;
  var newHTML = document.getElementById("rows").innerHTML;
  var counter = 0;
  for (var i = 0; i < masterpieces.length; i++) {
    var currentMP = masterpieces[i];
    var moduleName = "myModal" + i;
    newHTML += `
      <div class="col-lg-4">
        <div class="testimonial-item mx-auto mb-4 mb-lg-0">
          <img class="img-fluid mb-3" src="${currentMP}" alt="" />
          <button type="button" class="btn mb-3 btn-primary" data-toggle="modal" data-target="#${moduleName}">Show Image</button>
        </div>
      </div>
      <div id="${moduleName}" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body">
              <img class="img-responsive img-fluid" src="${currentMP}" />
            </div>
            <a href="./download?url=${currentMP}" target="_blank">Download</a>
          </div>
        </div>
      </div>`;
    mpArr.push(currentMP);
    counter++;
    if (counter >= 18) {
      document.getElementById("rows").innerHTML = newHTML;
      counter = 0;
    }
  }
  document.getElementById("rows").innerHTML = newHTML;
  document.getElementById("alertUser").innerHTML = `Successfully retrieved ${username}'s masterpieces!`;
  document.getElementById("alertUser").style.display = "block";
  document.getElementById("search").removeAttribute("disabled");
  document.getElementById("container1").innerHTML += `
    <div class="col-12 col-md-5 mx-auto">
      <button class="btn btn-block btn-lg btn-primary" onclick="downloadAllFiles()" id="exportAll">Export all</button>
    </div>`;
}

async function downloadAllFiles() {
  document.getElementById("exportAll").disabled = "true";
  let zip = new JSZip();
  var counter1 = 0;
  for (let file of mpArr) {
    let blob = await fetch(file).then(r => r.blob());
    let filename = `masterpiece-${counter1}.png`;
    zip.file(filename, blob);
    counter1++;
    document.getElementById("exportAll").innerHTML = `Downloaded ${counter1} out of ${mpArr.length} masterpieces!`;
  }

  zip.generateAsync({ type: 'blob' }).then((blobdata) => {
    let zipblob = new Blob([blobdata]);
    var elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(zipblob);
    elem.download = 'masterpieces' + uname + '.zip';
    elem.click();
    document.getElementById("exportAll").removeAttribute("disabled");
    document.getElementById("exportAll").innerHTML = `Successfully exported ${mpArr.length} masterpieces!`;
  });
}
