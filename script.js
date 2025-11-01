document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    // Add event listeners to cards - only after login
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const formId = card.id.replace('card-', 'form-');
            showForm(formId);
        });
    });
});


function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    const loginMessage = document.getElementById('login-message');
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');

    if (passwordInput === CORRECT_PASSWORD) {
        loginScreen.style.display = 'none'; // Hide the login screen
        appContainer.style.display = 'block'; // Show the main application
        document.body.classList.add('app-active'); // Adjust body alignment
        loginMessage.classList.remove('visible');
    } else {
        loginMessage.innerText = 'Incorrect password. Please try again.';
        loginMessage.classList.add('visible'); // Show error message
        document.getElementById('password-input').value = ''; // Clear password field
    }
}

// Function to show a specific form and hide others
function showForm(formIdToShow) {
    document.querySelector('.card-container').style.display = 'none'; // Hide cards
    document.querySelectorAll('.form-section').forEach(form => {
        form.style.display = 'none'; // Hide all forms
    });
    document.getElementById(formIdToShow).style.display = 'block'; // Show the selected form
    
    // Hide output and copy button when a form is initially shown
    const outputPre = document.getElementById(formIdToShow).querySelector('.query-output');
    if (outputPre) outputPre.innerText = '';
    const copyButton = document.getElementById(formIdToShow).querySelector('.copy-button');
    if (copyButton) copyButton.style.display = 'none';
}

// Function to hide a specific form and show cards
function hideForm(formIdToHide) {
    document.getElementById(formIdToHide).style.display = 'none'; // Hide the current form
    document.querySelector('.card-container').style.display = 'flex'; // Show cards
}

// --- Query Generation Functions (Unchanged) ---

function generateUpdateMobileQuery() {
    const mobileNumber = document.getElementById('update-mobile-number').value;
    const initiatorId = document.getElementById('update-initiator-id').value;
    const orgId = initiatorId.replace('U', ''); // Assuming initiatorId is U1914482, org_id is 1914482

    if (!mobileNumber || !initiatorId) {
        alert("Please enter both Mobile Number and Initiator ID.");
        return;
    }

    const query = `Dear Sir,
Kindly verify and approve the query below
@devops Please execute the script below on participant-masterv2_replica

--BackUp Query :
SELECT * FROM user_mstr WHERE user_id = '${initiatorId}';
SELECT * FROM registration_mstr WHERE org_id = '${orgId}';
SELECT * FROM cm_mstr WHERE cm_id = '${orgId}';
SELECT * FROM client_mstr WHERE operator_id = '${orgId}';
SELECT * FROM trading_account WHERE cm_tm_id = '${orgId}';

--Update Script :
UPDATE user_mstr SET user_mobile = '${mobileNumber}' WHERE user_id = '${initiatorId}';
UPDATE registration_mstr SET communication_person_mobile_no = '${mobileNumber}' WHERE org_id = '${orgId}';
UPDATE cm_mstr SET cm_client_contact = '${mobileNumber}' WHERE cm_id = '${orgId}';
UPDATE trading_account SET cm_client_mob_no = '${mobileNumber}', cm_client_contact = '${mobileNumber}' WHERE cm_tm_id = '${orgId}';
UPDATE client_mstr SET client_mob_no = '${mobileNumber}' WHERE operator_id = '${orgId}';`;

    document.getElementById('output-update-mobile').innerText = query;
    document.querySelector('#form-update-mobile .copy-button').style.display = 'inline-block';
}

function generateAddClientQuery() {
    const clientName = document.getElementById('add-client-name').value;

    if (!clientName) {
        alert("Please enter the Client Name.");
        return;
    }

    const query = `Dear Team,

Please execute below script on participant-masterv2_replica after approval.
Sir please approve.

INSERT INTO global_client
(client_name, client_image_path, client_db_conn_url, client_db_user, client_db_password, client_owner, client_driver, client_desc)
values('${clientName}', 'https://s3.ap-southeast-1.amazonaws.com/auction-v2-public-images.neml.in/CLIENT_IMAGES/No_Image_Available.jpg', 'jdbc:postgresql://masterapp.cluster-cgglfdaufnhq.ap-south-1.rds.amazonaws.com:1521/postgres', 'mktpgprd', 'rtgyhg2023', NULL, 'org.postgresql.Driver', '${clientName}');`;

    document.getElementById('output-add-client').innerText = query;
    document.querySelector('#form-add-client .copy-button').style.display = 'inline-block';
}

function generateAddDeliveryModeQuery() {
    const deliveryModeCode = document.getElementById('delivery-mode-code').value;

    if (!deliveryModeCode) {
        alert("Please enter the Delivery Mode.");
        return;
    }

    const query = `Dear Sir,
Kindly verify and approve the query below
@devops  , please execute the script below participant-masterv2_replica after approval.

--INSERT QUERY
INSERT INTO delivery_mode_mstr
(delivery_mode_code, delivery_mode_desc, seller_location, buyer_location, date_label, seller_location_label, buyer_location_label, date_offset, contract_location, contract_location_label, is_active, multiple_location_allowed, contract_code)
VALUES('${deliveryModeCode}', '${deliveryModeCode}', 'T', 'N', 'Delivery', 'Delivery location', 'Delivery location', 10, 'N', 'Delivery location', 'T', 'N', NULL);`;

    document.getElementById('output-add-delivery-mode').innerText = query;
    document.querySelector('#form-add-delivery-mode .copy-button').style.display = 'inline-block';
}


// --- Copy to Clipboard Function (Unchanged) ---
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const textToCopy = element.innerText;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert('Query copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy query. Please copy manually.');
        });
}

const CORRECT_PASSWORD = "DEVS_ONLY";