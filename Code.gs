function mainFunction() {

}

function onOpen(e) {
    FormApp.getUi()
        .createAddonMenu()
        .addItem('Configuration', 'showSidebar')
        //.addItem('About', 'showAbout')
        .addToUi();
}

/**
 * Opens a sidebar in the form containing the add-on's user interface for
 * configuring the notifications this add-on will produce.
 */
function showSidebar() {
    var ui = HtmlService.createHtmlOutputFromFile('sidebar')
        .setTitle('PujaCMS Configuartion');
    FormApp.getUi().showSidebar(ui);
}


function saveSettings(settings) {
    PropertiesService.getDocumentProperties().setProperties(settings);

    var form = FormApp.getActiveForm();
    var triggers = ScriptApp.getUserTriggers(form);

    // delete all existed onFormSubmit triggers
    for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT) {
            ScriptApp.deleteTrigger(triggers[i]);
        }
    }

    //create new onFormSubmit trigger
    ScriptApp.newTrigger('onFormSubmit')
        .forForm(form)
        .onFormSubmit()
        .create();
}

/**
 * Queries the User Properties and adds additional data required to populate
 * the sidebar UI elements.
 *
 * @return {Object} A collection of Property values and
 *     related data used to fill the configuration sidebar.
 */
function getSettings() {
    return PropertiesService.getDocumentProperties().getProperties();
}


function onFormSubmit(e) {
    var settings = PropertiesService.getDocumentProperties().getProperties();
    MailApp.sendEmail({
        to: settings['email'],
        subject: settings['subject'],
        name: settings['sender'],
        htmlBody: getEmailBody(e.response.getItemResponses(), settings['body']),
    });
}

function getEmailBody(responses, emailTemplateHtml) {
    return emailTemplateHtml.replace('{body}', getParseResponse(responses));
}

function getParseResponse(responses) {
    var tableString = '<table border="0" cellspacing="1" cellpadding="10" bgcolor="grey">';
    for (var key in responses) {
        tableString += '<tr><td style="background: #eee; font-weight: bold;">' + responses[key].getItem().getTitle() + '</td><td style="background: #eee;">' + responses[key].getResponse() + '</td></tr>';
    }
    tableString += '</table>';

    return tableString;
}










// [END apps_script_forms_notifications_quickstart]
