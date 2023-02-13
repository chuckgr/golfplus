/**
 * Triggers class to create/manage triggers for this app
 * 
 * TODO - Determine what triggers are installed
 *      - Create a new trigger if not already defined
 *      - Save trigger ID for deletion
 *      - What parameters are needed for this class?
 */
class Triggers {
  constructor(sheet) {
    this._sheet = sheet;
    this._triggerIDKey = "formSubmitTriggerId";
  }

  /**
   * Create the trigger
   * 
   * @param {object} options This contains the options, which right now is just the function to invoke
   *                 functionName: <string>
   */
  create(options) {
    let thisSheet = SpreadsheetApp.getActive();
    ScriptApp.newTrigger(option.functionName)
      .forSpreadsheet(thisSheet)
      .onFormSubmit()
      .create();
  }

  /**
   * Update trigger
   */
  update(options) {
    
  }

  /**
   * Find the trigger and return the trigger id
   * 
   * @return {number} theTrigger - return the trigger for the ID passed
   */
  find(id) {
    let triggers = ScriptApp.getProjectTriggers();
    let theTrigger = null;
    triggers.forEach(t => {
      if (t.getUniqueId() == id) {
        theTrigger = t;
      }
    });
    return theTrigger;
  }

  /**
   * Retireve the trigger ID
   * 
   * @return {string} Trigger ID saved at trigger creation or null
   */
  _getTriggerID() {
    // We will store/retrieve the id from properties for now
    let docProperties = PropertiesService.getDocumentProperties();
    return docProperties.getProperty(this._triggerIDKey);
  }

  /**
   * Save the trigger ID to a property
   * 
   * @param {string} triggerID - The numeric trigger ID 
   */
  _saveTriggerID(triggerID) {
    let docProperties = PropertiesService.getDocumentProperties();
    docProperties.setProperty(this._triggerIDKey, triggerID);
  }
}