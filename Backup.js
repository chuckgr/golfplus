/**
 * Backup class to keep a copy of the form responses
 */
class Backup {
  constructor() {
    this._backupFileName = `${SpreadsheetApp.getActiveSpreadsheet().getName()} backup`;
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
    let fileId = null;
    if (this.findFile(fileName) == null) {
      let resource = {
        title: fileName,
        mimeType: MimeType.GOOGLE_SHEETS,
        parents: [{ id: this._golfPlusDirectoryID }]
      }
      let fileJson = Drive.Files.insert(resource)
      fileId = fileJson.id  
    } 
    return fileId;
  }

  /**
   * Find the backup file
   */
  findFile(backupFileName) {
    let filesIter = DriveApp.getFilesByName(backupFileName);
    while (filesIter.hasNext()) { 
      this._ss = filesIter.next();
    }
    return this._ss;
  }

  /**
   * Full backup of the reponses sheet before adding new records
   */
  fullBackup(respSheet) {

  }
}