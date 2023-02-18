/**
 * Backup class to keep a copy of the form responses
 */
class Backup {
  constructor() {
    this._backupFileName = `${SpreadsheetApp.getActiveSpreadsheet().getName()} backup`;
    this._backupSheetName = 'Backup';
    this._ss = null;
    this._golfPlusDirectoryID = '1PUUa99wncEhzpMHdnGvpWDgXsLTB7Ran';
  }

  /**
   * Get the file name
   */
  get fileName() {return this._backupFileName;};

  /**
   * Create the backup file. 
   * 
   * NOTE: This requires the Advanced Drive Service to be enabled for it to work.
   *  1PUUa99wncEhzpMHdnGvpWDgXsLTB7Ran is the ID of the Golf+ directory
   * 
   * @param {string} fileName for the new
   */
  createFile(fileName) {
    if (this.findFile(fileName) == null) {
      let resource = {
        title: fileName,
        mimeType: MimeType.GOOGLE_SHEETS,
        parents: [{ id: this._golfPlusDirectoryID }]
      }
      let fileJson = Drive.Files.insert(resource)
      this._ss = SpreadsheetApp.openById(fileJson.id);   
    } 
    return this._ss;
  }

  /**
   * Find the backup file
   */
  findFile(backupFileName) {
    let ssFile;
    let filesIter = DriveApp.getFilesByName(backupFileName);
    while (filesIter.hasNext()) { 
      ssFile = filesIter.next();
    }
    if (ssFile) {
      this._ss = SpreadsheetApp.open(ssFile);
    }
    return this._ss;
  }

  /**
   * Add a record to the backup sheet
   * 
   * @param {array} Record to be added to the backup sheet
   */
  add(record) {
    let bkupSheet = this._ss.getSheetByName(this._backupSheetName);
    bkupSheet  
      .getRange(bkupSheet.getLastRow(), 1, 1, record.length)
      .setValues([record]); 
  }

  /**
   * Full backup of the reponses sheet before adding new records
   */
  fullBackup(respSheet) {
    let respData = respSheet
                    .getDataRange()
                    .getValues();
    if (this._ss) {
      let bkupSheet = this._ss.insertSheet(this._backupSheetName);
      bkupSheet.getRange(1,1,respData.length, respData[0].length).setValues(respData);
    }
  }
}