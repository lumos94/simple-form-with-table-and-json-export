const form = document.querySelector('#info-form');
const table = document.querySelector('#dataTable');
const exportButton = document.getElementById('exportJson');
const jsonDataContainer = document.getElementById('jsonDataContainer');
const verificationModal = document.getElementById('verification-modal');
const jsonDataModal = document.getElementById('json-data-modal');
const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]',
);

const validationMessage = document.getElementById(
    'validation-message',
);

let tableData = null;
let jsonData = [];
let dataId = 1;
let rowDeletion;

addRemoveNoDataWarning();

//submit form
form.addEventListener('submit', event => {
    event.preventDefault();
    validationMessage.innerHTML = "";

    let fname = document.querySelector('#first-name').value;
    let lname = document.querySelector('#last-name').value;
    let email = document.querySelector('#email').value;
    let age = document.querySelector('#age').value;
    let favColor = document.querySelector('#favColor').value;
    let contactEmail = document.querySelector('#checkbox-email').checked;
    let contactSms = document.querySelector('#checkbox-sms').checked;
    let contactPhoneCall = document.querySelector('#checkbox-phoneCall').checked;

    // validate inputs
    if (!atLeastOneCheckboxChecked(checkboxes)) {
        validationMessage.innerHTML =
            'At least once checkbox must be checked';
        return;
    }
    if (checkEmailIsValid(email)) {
        validationMessage.innerHTML =
            'Wrong email format';
        return;
    }
    if (checkAgeIsValid(age)) {
        validationMessage.innerHTML =
            'Age must not be more than 120';
        return;
    }

    addRemoveNoDataWarning();

    //create jsondata obj for printing on screen
    let formData = {
        id: dataId,
        fname: fname,
        lname: lname,
        email: email,
        age: age,
        favColor: favColor,
        contactPreference: {
            email: contactEmail,
            sms: contactSms,
            phoneCall: contactPhoneCall
        }
    }
    jsonData.push(formData)


    let emailCheck = contactEmail ? '<i class="material-icons text-green-600">check</i>' : '<i class="material-icons text-red-600">close</i>';

    let smsCheck = contactSms ? '<i class="material-icons text-green-600">check</i>' : '<i class="material-icons text-red-600">close</i>';

    let phoneCallCheck = contactPhoneCall ? '<i class="material-icons text-green-600">check</i>' : '<i class="material-icons text-red-600">close</i>';

    table.insertRow().innerHTML =
        `<td class='border px-8 py-4 entry-${dataId}' id='idCell-${dataId}'>${dataId}</td>` +
        `<td class='border px-8 py-4 entry-${dataId}' id='fnameCell-${dataId}'>${fname}</td>` +
        `<td class='border px-8 py-4 entry-${dataId}' id='lnameCell-${dataId}'>${lname}</td>` +
        `<td class='border px-8 py-4 entry-${dataId}' id='emailCell-${dataId}'>${email}</td>` +
        `<td class='border px-8 py-4 entry-${dataId}' id='ageCell-${dataId}'>${age}</td>` +
        `<td class='border px-8 py-4 entry-${dataId}' id='favColorCell-${dataId}'>${favColor}</td>` +
        `<td class='border px-8 py-4 entry-${dataId}' id='emailCheckCell-${dataId}'>${emailCheck}</td>` +
        `<td class='border px-8 py-4 entry-${dataId}' id='smsCheckCell-${dataId}'>${smsCheck}</td>` +
        `<td class='border px-8 py-4 entry-${dataId}' id='phoneCallCheckCell-${dataId}'>${phoneCallCheck}</td>` +
        `<td class='border px-8 py-4'><button class="text-amber-500 background-transparent font-bold uppercase px-3 py-1 text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 entry-${dataId}" id='deleteButton-${dataId}' onClick="toggleModal(this);" type="button">
<i class="material-icons text-red-800">delete</i>
</button></td>`;

    dataId++;
});

//event listener for opening json data modal and adding the data
exportButton.addEventListener('click', event => {
    toggleJsonModal();
    jsonDataContainer.innerHTML = JSON.stringify(jsonData, null, 2);
});

// check if at least one checkbox is checked
function atLeastOneCheckboxChecked(checkboxes) {
    return Array.from(checkboxes).some(
        checkbox => checkbox.checked,
    );
}

// Check if the email is valid.
function checkEmailIsValid(emailInput) {
    const emailRegex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInput)) {
        return true;
    }
}

// Check if the age is less than 120.
function checkAgeIsValid(ageInput) {
    if (ageInput > 120) {
        return true;
    }
}

function getTableRows() {
    let x = table.rows.length - 1;
    return x;
}

function addRemoveNoDataWarning() {
    let rowsNumber = getTableRows();

    if (rowsNumber === 0) {
        toggleExportButton(true);
        let emptyDataRow = table.insertRow().innerHTML =
            "<td colspan='10' class='text-center text-red-600 noData'>No Data</td>";
    } else {
        let noDataRow = document.getElementsByClassName('noData');
        if (noDataRow.length > 0) {
            toggleExportButton(false);
            table.deleteRow(1);
        }
    }
}

function deleteRow() {
    var i = rowDeletion.parentNode.parentNode.rowIndex;
    table.deleteRow(i);

    let id = getIDFromElement(rowDeletion.id);
    updateJsonDataObject(id);

    toggleModal();
    addRemoveNoDataWarning();
}

function updateJsonDataObject(id) {
    jsonData = jsonData.filter((object) => object.id !== parseInt(id));
}

function getIDFromElement(element) {
    let elemArr = element.split('-');
    return elemArr[1];
}


function toggleModal(row) {
    verificationModal.classList.toggle('hidden');
    if (row) {
        rowDeletion = row;
    }
}

function toggleJsonModal() {
    jsonDataModal.classList.toggle('hidden');
}

function toggleExportButton(disabled) {
    if (disabled) {
        exportButton.setAttribute('disabled', '');
    } else {
        exportButton.removeAttribute('disabled');
    }
}