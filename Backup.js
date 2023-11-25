/**
 * Backup class to keep a copy of the form responses
 */
class Backup {
  constructor() {
    this._backupFileName = `${SpreadsheetApp.getActiveSpreadsheet().getName()} backup`;
    this._backupSheetName = 'Backup';
    this._locationSheetName = 'Location';
    this._logSheetName = "Log"
    this._golfPlusDirectoryID = '1PUUa99wncEhzpMHdnGvpWDgXsLTB7Ran';
    this._ss = this.open(this._backupFileName);
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
    let fileJson;
    if (this.findFile(fileName) == null) {
      let resource = {
        title: fileName,
        mimeType: MimeType.GOOGLE_SHEETS,
        parents: [{ id: this._golfPlusDirectoryID }]
      }
      fileJson = Drive.Files.insert(resource)
      //this._ss = SpreadsheetApp.openById(fileJson.id);   
    } 
    return fileJson.id;
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
    if (!ssFile) {
      this._ssFile = this.createFile(backupFileName);
    } else {
      this._ssFile = ssFile;
    }
    return this._ssFile;
  }

  /**
   * Open the backup file name passed or the default file defined in the app
   * 
   * @param {string} - File name for the backup | this._backupFileName
   */
  open(fileName) {
    if (!fileName) {
      fileName = this._backupFileName;
    } else {
      this._backupFileName = fileName;
    }
    this._ss = SpreadsheetApp.open(this.findFile(fileName));
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
      .getRange(bkupSheet.getLastRow()+1, 1, 1, record.length)
      .setValues([record]); 
  }

  /**
   * Add the location of the user to the location spreadsheet
   * 
   * @param {object} Location object with the log/lat for this user
   */
  addLocation(locAry) {
    let locSheet = this._ss.getSheetByName(this._locationSheetName);
    const locRec = [new Date().toLocaleDateString(), locAry[0].toString(), locAry[1].toString()];
    locSheet
      .getRange(locSheet.getLastRow()+1, 1, 1, locRec.length)
      .setValues([locRec]); 
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