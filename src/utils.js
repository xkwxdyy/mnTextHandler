//简化弹窗通知
function showHUD(message,duration=2) {
  let focusWindow = Application.sharedInstance().focusWindow
  Application.sharedInstance().showHUD(message,focusWindow,2)
}
function copy(text) {
  UIPasteboard.generalPasteboard().string = text
}
function copyJSON(object) {
  UIPasteboard.generalPasteboard().string = JSON.stringify(object,null,2)
}
function studyController() {
  let focusWindow = Application.sharedInstance().focusWindow
  return Application.sharedInstance().studyController(focusWindow)
}

function getFocusNotes() {
  let focusWindow = Application.sharedInstance().focusWindow
  let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
  let selViewLst = notebookController.mindmapView.selViewLst
  // let focusNotes = 
  return selViewLst.map(tem=>{
    return tem.note.note
  })
}