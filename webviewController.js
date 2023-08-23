
var titleCaseController = JSB.defineClass('titleCaseController : UIViewController', {
  viewDidLoad: function() {
    let config  =  NSUserDefaults.standardUserDefaults().objectForKey("MNTextHandler")
    self.appInstance = Application.sharedInstance();
    self.closeImage = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(self.mainPath + `/stop.png`), 2)
    self.lastFrame = self.view.frame;
    self.currentFrame = self.view.frame
    self.mode = config?config.mode:1
    self.delm = config?config.delm:";"
    self.pref = config?config.pref:"- "
    self.moveDate = Date.now()
    self.view.layer.shadowOffset = {width: 0, height: 0};
    self.view.layer.shadowRadius = 15;
    self.view.layer.shadowOpacity = 0.5;
    self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
    self.view.layer.opacity = 1.0
    self.view.layer.cornerRadius = 11
    self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.8)
    self.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      Application.sharedInstance().defaultTextColor,
      0.8
    );

    self.moveButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.moveButton)

    self.closeButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.closeButton,"closeButtonTapped:")
    self.closeButton.setImageForState(self.closeImage,0)
    self.closeButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    self.closeButton.titleLabel.font = UIFont.systemFontOfSize(14);



    self.transformButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.transformButton,"transform:")
    self.transformButton.backgroundColor = UIColor.colorWithHexString("#5982c4");
    self.transformButton.layer.opacity = 1.0
    self.transformButton.setTitleForState("Transform",0)
    self.transformButton.titleLabel.font = UIFont.systemFontOfSize(16);

    self.optionButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.optionButton,"showOption:")
    self.optionButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    self.optionButton.layer.opacity = 0.5
    self.optionButton.setTitleForState("Option",0)
    self.optionButton.titleLabel.font = UIFont.systemFontOfSize(16);

    self.color = ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]




    self.textviewInput = UITextView.new()
    self.textviewInput.font = UIFont.systemFontOfSize(16);
    self.textviewInput.layer.cornerRadius = 8
    self.textviewInput.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.8)
    self.view.addSubview(self.textviewInput)
    self.textviewInput.text = `Input here`
    self.textviewInput.bounces = true

    self.textviewOutput = UITextView.new()
    self.textviewOutput.font = UIFont.systemFontOfSize(16);
    self.textviewOutput.layer.cornerRadius = 8
    self.textviewOutput.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.8)
    self.view.addSubview(self.textviewOutput)
    self.textviewOutput.text = `Output here`
    self.textviewOutput.bounces = true

    self.textviewDelim = UITextView.new()
    self.textviewDelim.font = UIFont.systemFontOfSize(16);
    self.textviewDelim.layer.cornerRadius = 8
    self.textviewDelim.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.8)
    self.view.addSubview(self.textviewDelim)
    self.textviewDelim.text = self.delm
    self.textviewDelim.bounces = true

    self.textviewPrefix = UITextView.new()
    self.textviewPrefix.font = UIFont.systemFontOfSize(16);
    self.textviewPrefix.layer.cornerRadius = 8
    self.textviewPrefix.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.8)
    self.view.addSubview(self.textviewPrefix)
    self.textviewPrefix.text = self.pref
    self.textviewPrefix.bounces = true

    self.pasteButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.pasteButton,"pasteButtonTapped:")
    self.pasteButton.layer.cornerRadius = 5
    self.pasteButton.setTitleForState("Paste",0)
    self.pasteButton.titleLabel.font = UIFont.systemFontOfSize(16);

    self.copyButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.copyButton,"copyButtonTapped:")
    self.copyButton.layer.cornerRadius = 5
    self.copyButton.setTitleForState("Copy",0)
    self.copyButton.titleLabel.font = UIFont.systemFontOfSize(16);

    // self.moveGesture0 = new UIPanGestureRecognizer(self,"onMoveGesture:")
    // self.pasteButton.addGestureRecognizer(self.moveGesture0)
    // self.moveGesture0.view.hidden = false
    // self.moveGesture0.addTargetAction(self,"onMoveGesture:")
    self.moveGesture1 = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.optionButton.addGestureRecognizer(self.moveGesture1)
    self.moveGesture1.view.hidden = false
    self.moveGesture1.addTargetAction(self,"onMoveGesture:")
    self.moveGesture2 = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.transformButton.addGestureRecognizer(self.moveGesture2)
    self.moveGesture2.view.hidden = false
    self.moveGesture2.addTargetAction(self,"onMoveGesture:")
    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
    self.moveGesture.view.hidden = false
    self.moveGesture.addTargetAction(self,"onMoveGesture:")

    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.closeButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false
    self.resizeGesture.addTargetAction(self,"onResizeGesture:")
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
viewWillLayoutSubviews: function() {
    if (self.miniMode) {
      return
    }
    var viewFrame = self.view.bounds;
    var xLeft     = viewFrame.x
    var xRight    = xLeft + viewFrame.width
    var yTop      = viewFrame.y
    var yBottom   = yTop + viewFrame.height
    self.closeButton.frame = {x: xRight-35,y: yBottom-35,width: 30,height: 30};
    self.moveButton.frame = {x: xLeft+5 ,y: yBottom-35,width: xRight-10,height: 30};
    var halfHeight = (viewFrame.height-100)*0.5
    var halfWidth = (viewFrame.width-15)*0.5
    viewFrame.y = 5
    viewFrame.x = 5
    viewFrame.height = halfHeight
    viewFrame.width = viewFrame.width -10
    self.textviewInput.frame = viewFrame
    self.pasteButton.frame = {  x: viewFrame.width-60,  y: viewFrame.height-30,  width: 60,  height: 30,};
    viewFrame.y = 10+halfHeight
    self.textviewOutput.frame = viewFrame
    self.copyButton.frame = {  x: viewFrame.width-60,  y: halfHeight+viewFrame.height-25,  width: 60,  height: 30,};
    viewFrame.y = 15+halfHeight*2
    viewFrame.height = 45
    viewFrame.width = halfWidth

    self.textviewDelim.frame = viewFrame
    self.transformButton.frame = {  x: xLeft+5,  y: yBottom-35,  width: viewFrame.width,  height: 30,};
    viewFrame.x = 10+halfWidth
    self.textviewPrefix.frame = viewFrame
    self.optionButton.frame = {  x: viewFrame.x,  y: yBottom-35,  width: viewFrame.width-30,  height: 30,}



  },
  scrollViewDidScroll: function() {
  },
  showOption: function(sender) {
    self.optionButton.backgroundColor = UIColor.colorWithHexString("#5982c4");
    self.optionButton.layer.opacity = 1.0
    // self.pasteButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    // self.pasteButton.layer.opacity = 0.5
    self.transformButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    self.transformButton.layer.opacity = 0.5
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    var menuController = MenuController.new();
    menuController.commandTable = [
      {title:'Title case convert', object:self, selector:'setOption:', param:1, checked:self.mode === 1},
      {title:'Split item', object:self, selector:'setOption:', param:2, checked:self.mode === 2},
      {title:'Convert to lower case', object:self, selector:'setOption:', param:3, checked:self.mode === 3},
      {title:'Keywords to MNtag', object:self, selector:'setOption:', param:4, checked:self.mode === 4},
      {title:'Find and replace', object:self, selector:'setOption:', param:5, checked:self.mode === 5},
    ];
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: 200,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    var studyController = Application.sharedInstance().studyController(self.view.window);
    self.view.popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,studyController.view);
    self.view.popoverController.presentPopoverFromRect(r, studyController.view, 1 << 1, true);
  },
  setOption: function (params) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.mode = params
    NSUserDefaults.standardUserDefaults().setObjectForKey({mode:self.mode,delm:self.delm,pref:self.pref},"MNTextHandler")
  },
  transform: function() {
    let input = self.textviewInput.text
    switch (self.mode) {
      case 1:  // 转英文标题规范格式
        // 输出框的文本用 toTitleCase() 方法处理
        self.textviewOutput.text = input.toTitleCase()
        // 将 textviewOutput.text 的内容复制到剪切板
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        break;
      case 2:  // 分割
        self.delm = self.textviewDelim.text
        self.pref = self.textviewPrefix.text
        self.textviewOutput.text = input.keyWords2Item(self.delm,self.pref)
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        // 把配置写到系统里
        NSUserDefaults.standardUserDefaults().setObjectForKey({mode:self.mode,delm:self.delm,pref:self.pref},"MNTextHandler")
        break;
      case 3:  // 转小写
        // 输出框的文本用 toTitleCase() 方法处理
        self.textviewOutput.text = input.toLowerCase()
        // 将 textviewOutput.text 的内容复制到剪切板
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        break;
      case 4:  // 转 MN 标签
        self.delm = self.textviewDelim.text
        self.pref = self.textviewPrefix.text
        self.textviewOutput.text = input.keyWords2MNTag(self.delm,self.pref)
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        // 把配置写到系统里
        NSUserDefaults.standardUserDefaults().setObjectForKey({mode:self.mode,delm:self.delm,pref:self.pref},"MNTextHandler")
        break;
      case 5: // 查找替换
        self.delm = self.textviewDelim.text
        self.pref = self.textviewPrefix.text
        self.textviewOutput.text = input.findReplace(self.delm,self.pref)
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        // 把配置写到系统里
        NSUserDefaults.standardUserDefaults().setObjectForKey({mode:self.mode,delm:self.delm,pref:self.pref},"MNTextHandler")
        break;
      default:
        self.textviewOutput.text = "no results"
        break;
    }
    // self.textviewOutput.text = input
    self.transformButton.backgroundColor = UIColor.colorWithHexString("#5982c4");
    self.transformButton.layer.opacity = 1.0
    // self.pasteButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    // self.pasteButton.layer.opacity = 0.5
    self.optionButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    self.optionButton.layer.opacity = 0.5
  },
  pasteButtonTapped: function() {
    // self.mode = 1
    // self.pasteButton.backgroundColor = UIColor.colorWithHexString("#5982c4");
    // self.pasteButton.layer.opacity = 1.0
    // self.optionButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    // self.optionButton.layer.opacity = 0.5
    // self.transformButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    // self.transformButton.layer.opacity = 0.5
    self.textviewInput.text = UIPasteboard.generalPasteboard().string
  },
  copyButtonTapped: function() {
    // self.mode = 1
    // self.pasteButton.backgroundColor = UIColor.colorWithHexString("#5982c4");
    // self.pasteButton.layer.opacity = 1.0
    // self.optionButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    // self.optionButton.layer.opacity = 0.5
    // self.transformButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    // self.transformButton.layer.opacity = 0.5
    UIPasteboard.generalPasteboard().string = self.textviewOutput.text
  },
  closeButtonTapped: function() {
    self.view.hidden = true;
    },
  onMoveGesture:function (gesture) {

    let locationToMN = gesture.locationInView(self.appInstance.studyController(self.view.window).view)
    if ( (Date.now() - self.moveDate) > 100) {
      let translation = gesture.translationInView(self.appInstance.studyController(self.view.window).view)
      let locationToBrowser = gesture.locationInView(self.view)
      let locationToButton = gesture.locationInView(gesture.view)
      let buttonFrame = self.moveButton.frame
      let newY = locationToButton.y-translation.y 
      let newX = locationToButton.x-translation.x
      if (gesture.state !== 3 && (newY<buttonFrame.height && newY>0 && newX<buttonFrame.width && newX>0 && Math.abs(translation.y)<20 && Math.abs(translation.x)<20)) {
        self.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
      }
    }
    self.moveDate = Date.now()
    let location = {x:locationToMN.x - self.locationToBrowser.x,y:locationToMN.y -self.locationToBrowser.y}
    let frame = self.view.frame
    var viewFrame = self.view.bounds;
    let studyFrame = self.appInstance.studyController(self.view.window).view.bounds
    let y = location.y
    if (y<=0) {
      y = 0
    }
    if (y>=studyFrame.height-15) {
      y = studyFrame.height-15
    }
    let x = location.x
    self.view.frame = {x:x,y:y,width:frame.width,height:frame.height}
    self.currentFrame  = self.view.frame
  },
  onResizeGesture:function (gesture) {
    self.custom = false;
    self.dynamic = false;
    let baseframe = gesture.view.frame
    let locationInView = gesture.locationInView(gesture.view)
    let frame = self.view.frame
    let width = locationInView.x+baseframe.x+baseframe.width*0.5
    let height = locationInView.y+baseframe.y+baseframe.height*0.5
    // 最小宽度
    if (width <= 200) {
      width = 200
    }
    // 最小高度
    if (height <= 100) {
      height = 100
    }
    self.view.frame = {x:frame.x,y:frame.y,width:width,height:height}
    self.currentFrame  = self.view.frame
  },
});
titleCaseController.prototype.setButtonLayout = function (button,targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(this.highlightColor, 1);
    button.backgroundColor = UIColor.colorWithHexString("#9bb2d6").colorWithAlphaComponent(0.8);
    button.layer.cornerRadius = 10;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.view.addSubview(button);
}
String.prototype.toTitleCase = function () {
  let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i
  let alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/
  let wordSeparators = /([ :–—-])/
  let lowerBar = /_/g;

  return this.replace(lowerBar, " ").split(wordSeparators)
    .map(function (current, index, array) {
      current = current.toLowerCase()
      if (
        /* Check for small words */
        current.search(smallWords) > -1 &&
        /* Skip first and last word */
        index !== 0 &&
        index !== array.length - 1 &&
        /* Ignore title end and subtitle start */
        array[index - 3] !== ':' &&
        array[index + 1] !== ':' &&
        /* Ignore small words that start a hyphenated phrase */
        (array[index + 1] !== '-' ||
          (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase()
      }

      /* Ignore intentional capitalization */
      if (current.substr(1).search(/[A-Z]|\../) > -1) {
        return current
      }

      /* Ignore URLs */
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current
      }

      /* Capitalize the first letter */
      return current.replace(alphanumericPattern, function (match) {
        return match.toUpperCase()
      })
    })
    .join('')
}

// 需求：关键词分割，并转换为无序列表
// 参数说明：
//   splitLabel 输入“分割点”
//   preLabel 输入“前缀”
// 效果：
//   1. 将输入的文本按照 splitLabel 分割为多个 items
//   2. item => preLabel + item
//   3. 将多个 item 用 \n 连接并输出
String.prototype.keyWords2Item = function (splitLabel, preLabel) {
  let splitLabelPattern = RegExp(`${splitLabel}`)
  // 要注意匹配 - 的时候如果不放在 [] 的首尾，需要用 \- 转义
  let punctuationDeletePattern = /^[\s.,;:–\-_!?]*([a-zA-Z0-9].*[a-zA-Z0-9])[\s.,;:–\-_!?]*$/g;
  // 去掉首位的标点符号
  let thisHandleVersion = this.replace(punctuationDeletePattern, "$1")
  // 再去掉一次空格（防止标点符号附近有空格）
  thisHandleVersion = thisHandleVersion.trim();
  if (splitLabelPattern.test(this)) {
    let items = thisHandleVersion.split(splitLabel).map(item=>preLabel+item.trim()).join('\n')  // 用换行符链接
    return items
  }else{
    return "No delimiter found"
  }
}

// 需求：将关键词转化为 MN 标签形式（即 #xxx），并转换为无序列表形式
// MN 标签的语法：
//   - 不能有空格 => 用下划线 _ 代替
//   - 不能有 -  => 用下划线 _ 代替
// 设计思路
// - 先分割
// - 将空格和 - 替换为下划线
// - 再转换为 MN 标签

String.prototype.keyWords2MNTag = function (splitLabel, preLabel) {
  let splitLabelPattern = RegExp(`${splitLabel}`)
  let mnTagPattern = /[\s\-]/g
  // 要注意匹配 - 的时候如果不放在 [] 的首尾，需要用 \- 转义
  let punctuationDeletePattern = /^[\s.,;:–\-_!?]*([a-zA-Z0-9].*[a-zA-Z0-9])[\s.,;:–\-_!?]*$/g;
  // 去掉首位的标点符号
  let thisHandleVersion = this.replace(punctuationDeletePattern, "$1")
  // 再去掉一次空格（防止标点符号附近有空格）
  thisHandleVersion = thisHandleVersion.trim();
  if (splitLabelPattern.test(this)) {
    let items = thisHandleVersion.split(splitLabel).map(item => preLabel + "#" + item.replace(mnTagPattern, "_")).join('\n')  // 用换行符链接
    return items
  }else{
    return "No delimiter found"
  }
}

// 查找替换
String.prototype.findReplace = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};