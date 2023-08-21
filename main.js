
JSB.newAddon = function (mainPath) {
  JSB.require('webviewController');
  var MNTitleCaseClass = JSB.defineClass(
    'MNTitleCase : JSExtension',
    { /* Instance members */
      sceneWillConnect: function () { //Window initialize
        self.appInstance = Application.sharedInstance();
        self.addonController = titleCaseController.new();
        self.addonController.mainPath = mainPath;
        self.rect = '{{0, 0}, {10, 10}}';
        self.arrow = 1;
      },

      sceneDidDisconnect: function () { // Window disconnect

      },

      sceneWillResignActive: function () { // Window resign active
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: function (notebookid) {
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          self.appInstance.studyController(self.window).refreshAddonCommands();
          self.appInstance.studyController(self.window).view.addSubview(self.addonController.view);
          self.addonController.view.hidden = true;
          NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onPopupMenuOnSelection:', 'PopupMenuOnSelection');
          // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onClosePopupMenuOnSelection:', 'ClosePopupMenuOnSelection');
          // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote');
          // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onClosePopupMenuOnNote:', 'ClosePopupMenuOnNote');
          // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onProcessNewExcerpt:', 'ProcessNewExcerpt');

            self.addonController.transformButton.hidden = false
            self.addonController.pasteButton.hidden = false
            self.addonController.view.frame = { x: 50, y: 100, width: 300, height: 400 }
            self.addonController.currentFrame = { x: 50, y: 100, width: 300, height: 400 }
          }
          NSTimer.scheduledTimerWithTimeInterval(0.2, false, function () {
            self.appInstance.studyController(self.window).becomeFirstResponder(); //For dismiss keyboard on iOS
          });
      },

      notebookWillClose: function (notebookid) {
      },

      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        if (controller !== self.appInstance.studyController(self.window)) {
          return;
        };
        if (!self.addonController.view.hidden) {
          let studyFrame = Application.sharedInstance().studyController(this.window).view.bounds
            let currentFrame = self.addonController.currentFrame
            if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
              currentFrame.x = studyFrame.width-currentFrame.width*0.5              
            }
            if (currentFrame.y >= studyFrame.height) {
              currentFrame.y = studyFrame.height-20              
            }
            self.addonController.view.frame = currentFrame
            self.addonController.currentFrame = currentFrame
        }
      },

      queryAddonCommandStatus: function () {
        if (self.appInstance.studyController(self.window).studyMode < 3) {
          return {
            image: 'logo.png',
            object: self,
            selector: 'toggleAddon:',
            checked: self.watchMode
          };
        } else {
          return null;
        }
      },

      onPopupMenuOnSelection: function (sender) { // Selecting text on pdf or epub
        if (self.addonController.view.hidden) {
          return
        }
        let textSelected  = sender.userInfo.documentController.selectionText
        if (textSelected) {
          self.addonController.textviewInput.text = textSelected
        }
      },
      onProcessNewExcerpt:function (sender) {
      },
      onPopupMenuOnNote: function (sender) { // Clicking note

      },
      toggleAddon:function (sender) {
      let textSelected = self.appInstance.studyController(self.window).readerController.currentDocumentController.selectionText
      if (textSelected) {
        self.addonController.textviewInput.text = textSelected
        self.addonController.view.hidden = false
      }else{
        self.addonController.view.hidden = !self.addonController.view.hidden
      }

      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: function () {
        // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNAutoStyle")
      },

      applicationWillEnterForeground: function () {
      },

      applicationDidEnterBackground: function () {
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );
  return MNTitleCaseClass;
};