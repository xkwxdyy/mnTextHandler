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